const UAParser = require('ua-parser-js');

const attemptStore = {};

function parseDevice(userAgent) {
  const parser = new UAParser(userAgent || '');
  const result = parser.getResult();
  return {
    deviceType: result.device.type || 'desktop',
    browser: `${result.browser.name || 'Unknown'} ${result.browser.version || ''}`.trim(),
    os: `${result.os.name || 'Unknown'} ${result.os.version || ''}`.trim()
  };
}

function trackAttempt(ip) {
  if (!attemptStore[ip]) {
    attemptStore[ip] = { count: 0 };
  }
  attemptStore[ip].count += 1;
  return attemptStore[ip].count;
}

function resetAttempts(ip) {
  delete attemptStore[ip];
}

module.exports = { parseDevice, trackAttempt, resetAttempts };