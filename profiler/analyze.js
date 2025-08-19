const fs = require('fs');

// Function to parse k6 JSON output
function parseK6Output(filePath) {
  const rawData = fs.readFileSync(filePath, 'utf8');
  const jsonData = JSON.parse(rawData);
  const metrics = jsonData.metrics;

  return {
    requestRate: metrics.http_reqs.rate,
    avgResponseTime: metrics.http_req_duration.avg,
    p95ResponseTime: metrics.http_req_duration['p(95)'],
    failRate: metrics.http_req_failed.value,
    iterations: metrics.iterations.count,
    dataReceived: metrics.data_received.count,
    dataSent: metrics.data_sent.count,
    maxVUs: metrics.vus_max.max
  };
}

// Function to format numbers
function formatNumber(num) {
  return num.toFixed(2).padStart(10);
}

// Main comparison function
function compareResults(bunFile, nestjsFile, golangFile, nestjsBunFile, rustFile) {
  const bunResults = parseK6Output(bunFile);
  const nestjsResults = parseK6Output(nestjsFile);
  const golangResults = parseK6Output(golangFile);
  const nestjsBunResults = parseK6Output(nestjsBunFile);
  const rustResults = parseK6Output(rustFile);



  console.log('Metric                 Bun            NestJS         Golang     NestJS Bun     Rust');
  console.log('---------------------------------------------------------------------------------');
  console.log(`Request Rate (req/s)   ${formatNumber(bunResults.requestRate)}  ${formatNumber(nestjsResults.requestRate)}  ${formatNumber(golangResults.requestRate)}    ${formatNumber(nestjsBunResults.requestRate)}   ${formatNumber(rustResults.requestRate)}`);
  console.log(`Avg Response Time (ms) ${formatNumber(bunResults.avgResponseTime)}  ${formatNumber(nestjsResults.avgResponseTime)}  ${formatNumber(golangResults.avgResponseTime)}   ${formatNumber(nestjsBunResults.avgResponseTime)}   ${formatNumber(rustResults.avgResponseTime)}`);
  console.log(`P95 Response Time (ms) ${formatNumber(bunResults.p95ResponseTime)}  ${formatNumber(nestjsResults.p95ResponseTime)}  ${formatNumber(golangResults.p95ResponseTime)}   ${formatNumber(nestjsBunResults.p95ResponseTime)} ${formatNumber(rustResults.p95ResponseTime)}`);
  console.log(`Failure Rate           ${formatNumber(bunResults.failRate)}  ${formatNumber(nestjsResults.failRate)}  ${formatNumber(golangResults.failRate)}   ${formatNumber(nestjsBunResults.failRate)}   ${formatNumber(rustResults.failRate)}`);
  console.log(`Total Iterations       ${formatNumber(bunResults.iterations)}   ${formatNumber(nestjsResults.iterations)}   ${formatNumber(golangResults.iterations)}    ${formatNumber(nestjsBunResults.iterations)}   ${formatNumber(rustResults.iterations)}`);
  console.log(`Data Received (bytes)  ${formatNumber(bunResults.dataReceived)}   ${formatNumber(nestjsResults.dataReceived)}   ${formatNumber(golangResults.dataReceived)}   ${formatNumber(nestjsBunResults.dataReceived)}   ${formatNumber(rustResults.dataReceived)}`);
  console.log(`Data Sent (bytes)      ${formatNumber(bunResults.dataSent)}    ${formatNumber(nestjsResults.dataSent)}    ${formatNumber(golangResults.dataSent)}   ${formatNumber(nestjsBunResults.dataSent)}   ${formatNumber(rustResults.dataSent)}`);
  console.log(`Max VUs                ${formatNumber(bunResults.maxVUs)}  ${formatNumber(nestjsResults.maxVUs)}   ${formatNumber(golangResults.maxVUs)}    ${formatNumber(nestjsBunResults.maxVUs)}   ${formatNumber(rustResults.maxVUs)}`);

}



// Check if files are provided as arguments
if (process.argv.length < 5) {
  console.log('Usage: node compare_k6_results.js <bun_results.json> <nestjs_results.json> <golang_results.json> <nestjs_bun_results.json> <rust_results.json>');
  process.exit(1);
}

// Run the comparison
compareResults(process.argv[2], process.argv[3], process.argv[4], process.argv[5], process.argv[6]);