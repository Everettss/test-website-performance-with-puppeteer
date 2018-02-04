const puppeteer = require('puppeteer');
const testPage = require('./testPage');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  console.log(await testPage(page));
  await browser.close();
})();
