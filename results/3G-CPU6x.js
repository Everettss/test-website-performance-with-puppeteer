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
  await client.send('Emulation.setCPUThrottlingRate', { rate: 6 });
};

const filePath = path.join(__dirname, '3G-CPU6x.json');

(async () => {
  await test(runs, emulateConditions, filePath);
})();
