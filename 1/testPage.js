const { extractDataFromPerformanceTiming } = require('./helpers');

async function testPage(page) {
  await page.goto('http://localhost:8080');

  const performanceTiming = JSON.parse(
    await page.evaluate(() => JSON.stringify(window.performance.timing))
  );

  return extractDataFromPerformanceTiming(
    performanceTiming,
    'responseEnd',
    'domInteractive',
    'domContentLoadedEventEnd',
    'loadEventEnd'
  );
}

module.exports = testPage;
