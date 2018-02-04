const { getTimeFromPerformanceMetrics, getCustomMetric } = require('./helpers');

async function testPage(page) {
  const client = await page.target().createCDPSession();
  await client.send('Performance.enable');

  const listLinksSpa = getCustomMetric(page, 'listLinksSpa');

  await page.goto('http://localhost:8080');

  const performanceMetrics = await client.send('Performance.getMetrics');
  const navigationStart = getTimeFromPerformanceMetrics(
    performanceMetrics,
    'NavigationStart'
  );

  return {
    listLinksSpa: (await listLinksSpa) - navigationStart,
  };
}

module.exports = testPage;
