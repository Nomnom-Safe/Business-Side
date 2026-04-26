const { GoogleGenAI } = require('@google/genai');
const {
  incCounter,
  recordFailureReason,
  recordParseLatency,
  snapshot,
} = require('../utils/importTelemetry');

const SYSTEM_PROMPT = `You are a menu data extraction assistant.
Your job is to parse raw text from restaurant menus and return structured JSON.

Return ONLY a valid JSON array. No markdown, no backticks, no explanation.
Each item must have exactly these fields:
{
  "name": "string (required — item name)",
  "description": "string (use empty string if not found)",
  "ingredients": ["array of strings — each ingredient as a separate string. Use empty array [] if not found."],
  "price": "number or null (numeric value only, no currency symbols)",
  "category": "string (infer from context, e.g. 'Appetizers', 'Entrees', 'Desserts', 'Drinks'. Use 'Uncategorized' if unknown.)",
  "possible_allergens": ["array of strings — ONLY list allergens explicitly mentioned in the text. Never infer or assume."]
}

CRITICAL RULES:
- ingredients MUST be a JSON array of strings, never a single string.
- possible_allergens MUST only include allergens explicitly stated in the source text.
- If allergen information is absent or ambiguous, return an empty array [].
- Do NOT guess allergens based on ingredients.`;

const MAX_RETRIES = 1;
const RETRY_DELAY_MS = 400;

function isTransientProviderError(err) {
  const m = String(err && err.message ? err.message : '').toLowerCase();
  return (
    m.includes('timeout')
    || m.includes('timed out')
    || m.includes('429')
    || m.includes('503')
    || m.includes('temporar')
    || m.includes('rate limit')
    || m.includes('network')
    || m.includes('econnreset')
  );
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function parseMenuText(extractedText, options = {}) {
  if (!extractedText || extractedText.trim().length === 0) {
    throw new Error('No text content provided for parsing');
  }

  const correlationId = options.correlationId || 'n/a';
  const started = Date.now();
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  incCounter('parse_attempts');
  console.info(JSON.stringify({
    event: 'import.parse.start',
    correlationId,
    textLength: extractedText.length,
  }));

  let response;
  let lastErr = null;
  try {
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
      try {
        response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            {
              role: 'user',
              parts: [{
                text: `Parse the following menu text and return the structured JSON array:\n\n${extractedText}`,
              }],
            },
          ],
          config: {
            systemInstruction: SYSTEM_PROMPT,
            temperature: 0.1,
          },
        });
        break;
      } catch (err) {
        lastErr = err;
        if (attempt < MAX_RETRIES && isTransientProviderError(err)) {
          await sleep(RETRY_DELAY_MS);
          continue;
        }
        throw err;
      }
    }
  } catch (err) {
    incCounter('parse_failed');
    recordFailureReason('PROVIDER_ERROR');
    recordParseLatency(Date.now() - started);
    console.warn(JSON.stringify({
      event: 'import.parse.failed',
      correlationId,
      reason: 'PROVIDER_ERROR',
      error: err.message,
      telemetry: snapshot(),
    }));
    throw err;
  }

  const rawText = response.text.trim();
  
  // Strip markdown code fences if the model included them anyway
  const cleaned = rawText.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();

  try {
    const items = JSON.parse(cleaned);
    if (!Array.isArray(items)) {
      throw new Error('LLM response was not a JSON array');
    }
    incCounter('parse_success');
    recordParseLatency(Date.now() - started);
    console.info(JSON.stringify({
      event: 'import.parse.success',
      correlationId,
      itemCount: items.length,
      telemetry: snapshot(),
    }));
    return items;
  } catch (err) {
    incCounter('parse_failed');
    recordFailureReason('INVALID_JSON');
    recordParseLatency(Date.now() - started);
    console.warn(JSON.stringify({
      event: 'import.parse.failed',
      correlationId,
      reason: 'INVALID_JSON',
      error: err.message,
      lastErr: lastErr ? String(lastErr.message || lastErr) : null,
      telemetry: snapshot(),
    }));
    throw new Error(`Failed to parse LLM response as JSON: ${err.message}`);
  }
}

module.exports = { parseMenuText };