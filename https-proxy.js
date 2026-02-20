const https = require('https');
const http = require('http');
const fs = require('fs');

// Simple HTTPS reverse proxy to localhost:3000
const options = {
  key: fs.readFileSync('/home/moltbot/ssl/key.pem'),
  cert: fs.readFileSync('/home/moltbot/ssl/cert.pem')
};

const server = https.createServer(options, (req, res) => {
  // Forward to local HTTP server
  const proxyReq = http.request({
    hostname: '127.0.0.1',
    port: 3000,
    path: req.url,
    method: req.method,
    headers: req.headers
  }, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });
  proxyReq.on('error', () => res.end('Backend unavailable'));
  req.pipe(proxyReq);
});

server.listen(3443, '0.0.0.0', () => {
  console.log('HTTPS proxy running on https://0.0.0.0:3443 → http://localhost:3000');
});
