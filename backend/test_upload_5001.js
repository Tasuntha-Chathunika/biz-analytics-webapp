const fs = require('fs');
const http = require('http');

const boundary = '--------------------------' + Math.random().toString(16);
const postData = Buffer.concat([
  Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="test.csv"\r\nContent-Type: text/csv\r\n\r\n`),
  fs.readFileSync('test.csv'),
  Buffer.from(`\r\n--${boundary}--\r\n`)
]);

const req = http.request({
  hostname: 'localhost',
  port: 5001,
  path: '/api/upload',
  method: 'POST',
  headers: {
    'Content-Type': `multipart/form-data; boundary=${boundary}`,
    'Content-Length': postData.length
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Response:', res.statusCode, data));
});
req.write(postData);
req.end();
