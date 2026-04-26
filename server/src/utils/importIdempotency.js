'use strict';

const TTL_MS = 15 * 60 * 1000;

const store = new Map();

function prune() {
  const now = Date.now();
  for (const [k, v] of store) {
    if (now - v.ts > TTL_MS) store.delete(k);
  }
}

/**
 * @param {string} key
 * @returns {object|undefined} cached { status, body }
 */
function getResponse(key) {
  if (!key) return undefined;
  prune();
  const v = store.get(String(key));
  if (!v || Date.now() - v.ts > TTL_MS) {
    if (v) store.delete(String(key));
    return undefined;
  }
  return v;
}

/**
 * @param {string} key
 * @param {number} status
 * @param {object} body
 */
function setResponse(key, status, body) {
  if (!key) return;
  store.set(String(key), { status, body, ts: Date.now() });
}

module.exports = { getResponse, setResponse, TTL_MS };
