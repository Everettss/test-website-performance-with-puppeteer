const {
  getTimeFromPerformanceMetrics,
  extractDataFromTracing,
} = require('./helpers');

async function testPage(page) {
  const client = await page.target().createCDPSession();
  await client.send('Performance.enable');
  await page.tracing.start({ path: './trace.json' });

  await page.goto('http://localhost:8080');

  await page.tracing.stop();
  const cssTracing = await extractDataFromTracing(
    './trace.json',
    'common.3a2d55439989ceade22e.css'
  );

  const performanceMetrics = await client.send('Performance.getMetrics');
  const navigationStart = getTimeFromPerformanceMetrics(
    performanceMetrics,
    'NavigationStart'
  );

  return {
    cssStart: cssTracing.start - navigationStart,
    cssEnd: cssTracing.end - navigationStart,
  };
}

module.exports = testPage;
