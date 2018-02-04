const fs = require('fs');

const extractDataFromPerformanceTiming = (timing, ...dataNames) => {
  const navigationStart = timing.navigationStart;

  const extractedData = {};
  dataNames.forEach(name => {
    extractedData[name] = timing[name] - navigationStart;
  });

  return extractedData;
};

const getTimeFromPerformanceMetrics = (metrics, name) =>
  metrics.metrics.find(x => x.name === name).value * 1000;

const extractDataFromPerformanceMetrics = (metrics, ...dataNames) => {
  const navigationStart = getTimeFromPerformanceMetrics(
    metrics,
    'NavigationStart'
  );

  const extractedData = {};
  dataNames.forEach(name => {
    extractedData[name] =
      getTimeFromPerformanceMetrics(metrics, name) - navigationStart;
  });

  return extractedData;
};

function getCustomMetric(page, name) {
  return new Promise(resolve =>
    page.on('metrics', ({ title, metrics }) => {
      if (name === title) {
        resolve(metrics.Timestamp * 1000);
      }
    })
  );
}

const extractDataFromTracing = (path, name) =>
  new Promise(resolve => {
    fs.readFile(path, (err, data) => {
      const tracing = JSON.parse(data);

      const resourceTracings = tracing.traceEvents.filter(
        x =>
          x.cat === 'devtools.timeline' &&
          typeof x.args.data !== 'undefined' &&
          typeof x.args.data.url !== 'undefined' &&
          x.args.data.url.endsWith(name)
      );
      const resourceTracingSendRequest = resourceTracings.find(
        x => x.name === 'ResourceSendRequest'
      );
      const resourceId = resourceTracingSendRequest.args.data.requestId;
      const resourceTracingEnd = tracing.traceEvents.filter(
        x =>
          x.cat === 'devtools.timeline' &&
          typeof x.args.data !== 'undefined' &&
          typeof x.args.data.requestId !== 'undefined' &&
          x.args.data.requestId === resourceId
      );
      const resourceTracingStartTime = resourceTracingSendRequest.ts / 1000;
      const resourceTracingEndTime =
        resourceTracingEnd.find(x => x.name === 'ResourceFinish').ts / 1000;

      fs.unlink(path, () => {
        resolve({
          start: resourceTracingStartTime,
          end: resourceTracingEndTime,
        });
      });
    });
  });

module.exports = {
  extractDataFromPerformanceTiming,
  getTimeFromPerformanceMetrics,
  extractDataFromPerformanceMetrics,
  getCustomMetric,
  extractDataFromTracing,
};
