const express = require('express');
const multer = require('multer');
const uploadController = require('./controllers/uploadController');
const app = express();
const upload = multer({ dest: 'uploads/' });
app.post('/api/upload', upload.single('file'), uploadController.uploadCSV);
app.listen(5001, () => {
  console.log('Test server on 5001');
  const { exec } = require('child_process');
  exec('node test_upload_5001.js', (err, stdout, stderr) => {
    console.log(stdout);
    console.error(stderr);
    process.exit(0);
  });
});
