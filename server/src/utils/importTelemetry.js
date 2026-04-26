'use strict';

const counters = {
  parse_attempts: 0,
  parse_success: 0,
  parse_failed: 0,
};

const failByReason = {};
const latenciesMs = [];
const MAX_LATENCY_SAMPLES = 500;

function incCounter(name, delta = 1) {
  counters[name] = (counters[name] || 0) + delta;
}

function recordFailureReason(reason) {
  const key = String(reason || 'unknown');
  failByReason[key] = (failByReason[key] || 0) + 1;
}

function recordParseLatency(ms) {
  if (!Number.isFinite(ms) || ms < 0) return;
  latenciesMs.push(ms);
  if (latenciesMs.length > MAX_LATENCY_SAMPLES) {
    latenciesMs.shift();
  }
}

function median(values) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

function snapshot() {
  return {
    ...counters,
    fail_by_reason: { ...failByReason },
    median_parse_latency_ms: median(latenciesMs),
  };
}

module.exports = {
  incCounter,
  recordFailureReason,
  recordParseLatency,
  snapshot,
};

