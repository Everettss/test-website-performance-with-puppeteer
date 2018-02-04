const puppeteer = require('puppeteer');
const testPage = require('./testPage');

(async () => {
  let browser = await puppeteer.launch();
  let page = await browser.newPage();
  const client = await page.target().createCDPSession();
  await client.send('Network.enable');
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 200, // ms
    downloadThroughput: 780 * 1024 / 8, // 780 kb/s
    uploadThroughput: 330 * 1024 / 8, // 330 kb/s
  });
  await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  console.log(await testPage(page, client));
  await browser.close();
})();
