const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `You are a menu data extraction assistant. 
Your job is to parse raw text from restaurant menus and return structured JSON.

Return ONLY a valid JSON array. No markdown, no backticks, no explanation.
Each item must have exactly these fields:
{
  "name": "string (required)",
  "description": "string (use empty string if not found)",
  "ingredients": "string (use empty string if not found)",
  "price": "number or null (numeric value only, no $ sign)",
  "category": "string (infer from context, e.g. 'Appetizers', 'Entrees', 'Desserts', 'Drinks')",
  "possible_allergens": ["array of strings — ONLY list allergens explicitly mentioned in the text. Never infer or assume."]
}

CRITICAL RULE: For possible_allergens, only include allergens that are explicitly stated 
in the source text. If allergen information is absent or ambiguous, return an empty array [].
Do NOT guess based on ingredients.`;

async function parseMenuText(extractedText) {
  if (!extractedText || extractedText.trim().length === 0) {
    throw new Error('No text content provided for parsing');
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      {
        role: 'user',
        parts: [{ 
          text: `Parse the following menu text and return the structured JSON array:\n\n${extractedText}` 
        }]
      }
    ],
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.1, // Low temperature = more deterministic, better for structured extraction
    }
  });

  const rawText = response.text.trim();
  
  // Strip markdown code fences if the model included them anyway
  const cleaned = rawText.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();

  try {
    const items = JSON.parse(cleaned);
    if (!Array.isArray(items)) {
      throw new Error('LLM response was not a JSON array');
    }
    return items;
  } catch (err) {
    throw new Error(`Failed to parse LLM response as JSON: ${err.message}`);
  }
}

module.exports = { parseMenuText };