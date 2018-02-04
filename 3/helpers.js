const getTimeFromPerformanceMetrics = (metrics, name) =>
  metrics.metrics.find(x => x.name === name).value * 1000;

const getCustomMetric = (page, name) =>
  new Promise(resolve =>
    page.on('metrics', ({ title, metrics }) => {
      if (title === name) {
        resolve(metrics.Timestamp * 1000);
      }
    })
  );

module.exports = {
  getTimeFromPerformanceMetrics,
  getCustomMetric,
};
