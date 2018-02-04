const puppeteer = require('puppeteer');
const testPage = require('./testPage');

(async () => {
  let browser = await puppeteer.launch();
  let page = await browser.newPage();
  let client = await page.target().createCDPSession();

  console.log(await testPage(page, client)); // first enter
  console.log(await testPage(page, client)); // second enter with cache and sw
  await browser.close();

  browser = await puppeteer.launch();
  page = await browser.newPage();
  client = await page.target().createCDPSession();
  await client.send('ServiceWorker.enable');
  await testPage(page, client); // only for creating fresh instance
  await client.send('ServiceWorker.stopAllWorkers');
  console.log(await testPage(page, client)); // second enter only with cache
  await browser.close();

  browser = await puppeteer.launch();
  page = await browser.newPage();
  client = await page.target().createCDPSession();
  await client.send('Network.enable');
  await testPage(page, client); // only for creating fresh instance
  await client.send('Network.clearBrowserCache');
  console.log(await testPage(page, client)); // second enter only with sw
  await browser.close();
})();
