const path = require('path');
const test = require('./test/index');

const runs = 3;
const emulateConditions = async client => {
  await client.send('Network.enable');
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 28,
    downloadThroughput: 5 * 1024 * 1024 / 8,
    uploadThroughput: 1024 * 1024 / 8,
  });
};

const filePath = path.join(__dirname, 'cable.json');

(async () => {
  await test(runs, emulateConditions, filePath);
})();
