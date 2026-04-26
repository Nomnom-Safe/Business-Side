'use strict';

/* global fetch */
const dns = require('dns').promises;
const net = require('net');
const cheerio = require('cheerio');

const MAX_HTML_BYTES = 2 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 20000;
const USER_AGENT = 'NomNomSafe-MenuImport/1.0';

function isIPv4PrivateOrBlocked(ip) {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some(n => n < 0 || n > 255)) return true;
  const [a, b] = parts;
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 0) return true;
  if (a === 169 && b === 254) return true;
  if (a === 192 && b === 168) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  return false;
}

function isIPv6PrivateOrBlocked(ip) {
  const lower = ip.toLowerCase();
  if (lower === '::1') return true;
  if (lower.startsWith('fe80:')) return true;
  if (lower.startsWith('fc') || lower.startsWith('fd')) return true;
  if (lower.startsWith('::ffff:')) {
    const v4 = lower.slice(7);
    if (isIPv4PrivateOrBlocked(v4)) return true;
  }
  return false;
}

function blockHostError() {
  const err = new Error('This URL cannot be reached for security reasons.');
  err.code = 'IMPORT_URL_BLOCKED_HOST';
  return err;
}

async function assertSafeHostname(hostname) {
  if (!hostname || typeof hostname !== 'string') throw blockHostError();
  const h = hostname.toLowerCase();
  if (h === 'localhost' || h === '0.0.0.0' || h.endsWith('.local')) {
    throw blockHostError();
  }
  if (net.isIP(h)) {
    if (net.isIPv4(h) && isIPv4PrivateOrBlocked(h)) throw blockHostError();
    if (net.isIPv6(h) && isIPv6PrivateOrBlocked(h)) throw blockHostError();
    return;
  }
  const { address } = await dns.lookup(h, { all: false, verbatim: true });
  if (net.isIPv4(address) && isIPv4PrivateOrBlocked(address)) throw blockHostError();
  if (net.isIPv6(address) && isIPv6PrivateOrBlocked(address)) throw blockHostError();
}

function parseAndValidateUrl(urlString) {
  if (typeof urlString !== 'string' || !urlString.trim()) return null;
  let u;
  try {
    u = new URL(urlString.trim());
  } catch {
    return null;
  }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
  if (!u.hostname) return null;
  return u;
}

function extractTextFromHtml(html) {
  const $ = cheerio.load(html);
  $('script, style, noscript, svg').remove();
  $('nav, footer, header, [role="navigation"]').remove();
  const text = $('body').length ? $('body').text() : $.root().text();
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Fetches a public URL, blocks private/reserved hosts (SSRF mitigation), extracts visible text.
 */
async function fetchPageText(urlString) {
  const u = parseAndValidateUrl(urlString);
  if (!u) {
    const err = new Error('Invalid URL. Use http or https.');
    err.code = 'IMPORT_URL_FETCH_FAILED';
    throw err;
  }
  await assertSafeHostname(u.hostname);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  let res;
  try {
    // eslint-disable-next-line no-undef
    res = await fetch(u.toString(), {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.8',
      },
    });
  } catch (e) {
    if (e.name === 'AbortError') {
      const err = new Error("We couldn't read this page in time.");
      err.code = 'IMPORT_URL_TIMEOUT';
      throw err;
    }
    const err = new Error(e.message || "We couldn't read this page.");
    err.code = 'IMPORT_URL_FETCH_FAILED';
    throw err;
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) {
    const err = new Error(`Could not load page (HTTP ${res.status}).`);
    err.code = 'IMPORT_URL_FETCH_FAILED';
    throw err;
  }
  const buf = await res.arrayBuffer();
  if (buf.byteLength > MAX_HTML_BYTES) {
    const err = new Error('Page is too large to import.');
    err.code = 'IMPORT_URL_FETCH_FAILED';
    throw err;
  }
  const html = Buffer.from(buf).toString('utf-8');
  return extractTextFromHtml(html);
}

module.exports = {
  fetchPageText,
  parseAndValidateUrl,
  assertSafeHostname,
  extractTextFromHtml,
  FETCH_TIMEOUT_MS,
};
