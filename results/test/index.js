const fs = require('fs');
const { promisify } = require('util');

const puppeteer = require('puppeteer');
const testPage = require('./testPage');
const ProgressBar = require('progress');

const convertResultsToArr = (res, stage) => {
  const arr = [];

  for (let [variable, value] of Object.entries(res)) {
    arr.push({
      variable,
      value,
      stage,
    });
  }
  return arr;
};

const test = async (runs, emulateConditions, filePath) => {
  const bar = new ProgressBar(':bar :percent :current/:total remain :eta s', {
    total: runs * 6,
  });

  await promisify(fs.writeFile)(filePath, JSON.stringify([]));
  for (let i = 0; i < runs; i++) {
    let res = [];

    // ------- first browser run ---------
    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    let client = await page.target().createCDPSession();
    await emulateConditions(client);

    // first enter test
    res = [
      ...res,
      ...convertResultsToArr(await testPage(page, client), 'firstEnter'),
    ];

    bar.tick();
    await page.close();

    page = await browser.newPage();
    client = await page.target().createCDPSession();
    await emulateConditions(client);

    // second enter test with ServiceWorker and cache
    res = [
      ...res,
      ...convertResultsToArr(await testPage(page, client), 'swAndCache'),
    ];

    bar.tick();
    await browser.close();

    // ------- second browser run ---------
    browser = await puppeteer.launch();
    page = await browser.newPage();
    client = await page.target().createCDPSession();

    // first enter only for hydration ServiceWorker and cache
    await testPage(page, client);

    bar.tick();
    await page.close();

    page = await browser.newPage();
    client = await page.target().createCDPSession();
    await emulateConditions(client);

    await client.send('ServiceWorker.enable');
    await client.send('ServiceWorker.unregister', {
      scopeURL: 'http://localhost:8080/',
    });

    // second enter test with cache
    res = [
      ...res,
      ...convertResultsToArr(await testPage(page, client), 'cache'),
    ];
    bar.tick();
    await browser.close();

    // ------- third browser run ---------
    browser = await puppeteer.launch();
    page = await browser.newPage();
    client = await page.target().createCDPSession();

    // first enter only for hydration ServiceWorker and cache
    await testPage(page, client);

    bar.tick();
    await page.close();

    page = await browser.newPage();
    client = await page.target().createCDPSession();
    await emulateConditions(client);
    await client.send('Network.clearBrowserCache');

    // second enter test with ServiceWorker
    res = [...res, ...convertResultsToArr(await testPage(page, client), 'sw')];

    bar.tick();
    await browser.close();

    const file = JSON.parse(await promisify(fs.readFile)(filePath));
    await promisify(fs.writeFile)(filePath, JSON.stringify([...file, ...res]));
  }
};

module.exports = test;
