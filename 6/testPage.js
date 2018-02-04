const {
  extractDataFromPerformanceTiming,
  getTimeFromPerformanceMetrics,
  extractDataFromPerformanceMetrics,
  getCustomMetric,
  extractDataFromTracing,
} = require('./helpers');

async function testPage(page, client) {
  await client.send('Performance.enable');

  const listLinksSpa = getCustomMetric(page, 'listLinksSpa');
  await page.tracing.start({ path: './trace.json' });

  await page.goto('http://localhost:8080');

  const performanceTiming = JSON.parse(
    await page.evaluate(() => JSON.stringify(window.performance.timing))
  );

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

  await page.tracing.stop();

  const navigationStart = getTimeFromPerformanceMetrics(
    performanceMetrics,
    'NavigationStart'
  );

  const cssTracing = await extractDataFromTracing(
    './trace.json',
    'common.3a2d55439989ceade22e.css'
  );

  return {
    cssStart: cssTracing.start - navigationStart,
    cssEnd: cssTracing.end - navigationStart,
    listLinksSpa: (await listLinksSpa) - navigationStart,
    ...extractDataFromPerformanceMetrics(
      performanceMetrics,
      'FirstMeaningfulPaint'
    ),
    ...extractDataFromPerformanceTiming(
      performanceTiming,
      'responseEnd',
      'domInteractive',
      'domContentLoadedEventEnd',
      'loadEventEnd'
    ),
  };
}

module.exports = testPage;
