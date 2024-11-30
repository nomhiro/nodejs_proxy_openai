const http = require('http');
const https = require('https');
const url = require('url');

const proxy = http.createServer((req, res) => {
  console.log(`🚀Received request: ${req.method} ${req.url}`);

  const parsedUrl = url.parse(req.url);
  const targetUrl = parsedUrl.path;

  const options = {
    hostname: 'aoai-rag.openai.azure.com', // 転送先のホスト名
    port: 443, // 転送先のポート
    path: targetUrl,
    method: req.method,
    headers: req.headers,
    rejectUnauthorized: false // 証明書の検証をスキップ
  };
  console.log(` Proxying request to: ${options.hostname}${options.path}`);
  // headerのhostを変更
  options.headers.host = 'aoai-rag.openai.azure.com';
  console.log(` headers: ${JSON.stringify(options.headers)}`);
  
  const proxyReq = https.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });

    // 転送先からの応答をコンソールに出力
    proxyRes.on('data', (chunk) => {
      console.log(`Response chunk: ${chunk}`);
    });

    proxyRes.on('end', () => {
      console.log('Response ended.');
    });
  });

  req.pipe(proxyReq, { end: true });

  proxyReq.on('error', (err) => {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Something went wrong.');
    console.error(err);
  });
});

proxy.listen(3000, () => {
  console.log('Proxy server is running on port 3000');
});