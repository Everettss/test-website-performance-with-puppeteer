const fs = require('fs');

const getTimeFromPerformanceMetrics = (metrics, name) =>
  metrics.metrics.find(x => x.name === name).value * 1000;

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

      resolve({
        start: resourceTracingStartTime,
        end: resourceTracingEndTime,
      });
    });
  });

module.exports = {
  getTimeFromPerformanceMetrics,
  extractDataFromTracing,
};
