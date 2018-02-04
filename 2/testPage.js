const {
  getTimeFromPerformanceMetrics,
  extractDataFromPerformanceMetrics,
} = require('./helpers');

async function testPage(page) {
  const client = await page.target().createCDPSession();
  await client.send('Performance.enable');

  await page.goto('http://localhost:8080');

  let firstMeaningfulPaint = 0;
  let performanceMetrics;
  while (firstMeaningfulPaint === 0) {
    await page.waitFor(300);
    performanceMetrics = await client.send('Performance.getMetrics');
    firstMeaningfulPaint = getTimeFromPerformanceMetrics(
      performanceMetrics,
      'FirstMeaningfulPaint'
    );
  }

  return extractDataFromPerformanceMetrics(
    performanceMetrics,
    'FirstMeaningfulPaint'
  );
}

module.exports = testPage;
