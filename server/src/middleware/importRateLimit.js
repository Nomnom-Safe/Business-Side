'use strict';

const WINDOW_MS = 60 * 1000;
const MAX_REQ_PER_WINDOW = 30;
const buckets = new Map();

function now() {
  return Date.now();
}

function getClientKey(req) {
  const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
  return `${ip}:${req.path}`;
}

function importRateLimit(req, res, next) {
  const key = getClientKey(req);
  const ts = now();
  const prev = buckets.get(key);

  if (!prev || ts - prev.windowStart > WINDOW_MS) {
    buckets.set(key, { windowStart: ts, count: 1 });
    return next();
  }

  prev.count += 1;
  buckets.set(key, prev);

  if (prev.count > MAX_REQ_PER_WINDOW) {
    return res.status(429).json({
      success: false,
      code: 'IMPORT_RATE_LIMITED',
      error: 'Too many import requests. Please wait and try again.',
      fallback: 'Try again in about a minute.',
      correlationId: req.correlationId || null,
    });
  }

  return next();
}

module.exports = { importRateLimit };

