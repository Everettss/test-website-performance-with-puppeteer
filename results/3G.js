const path = require('path');
const test = require('./test/index');

const runs = 3;
const emulateConditions = async client => {
  await client.send('Network.enable');
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 200,
    downloadThroughput: 768 * 1024 / 8,
    uploadThroughput: 330 * 1024 / 8,
  });
};

const filePath = path.join(__dirname, '3G.json');

(async () => {
  await test(runs, emulateConditions, filePath);
})();
