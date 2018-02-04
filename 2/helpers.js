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

module.exports = {
  getTimeFromPerformanceMetrics,
  extractDataFromPerformanceMetrics,
};
