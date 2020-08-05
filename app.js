/* global require */

const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const path = require('path');
const os = require('os');
const fs = require('fs');

const PORT = process.env.PORT || 3000;

var express = require('express');
var app = express();
app.use(express.static('.'));

app.get('/', function (req, res) {
  res.redirect('/videoCapture.html')
})

app.post('/', multipartMiddleware, function(req, res) {
  let location = path.join(__dirname + '/uploads/', `${new Date().getTime()}.webm`);
  
  fs.rename(req.files.data.path, location,() => {
    res.send(`upload successful, file written to ${location}`);
  });
});

app.listen(PORT, function () {
  console.log('Example app listening on port 3000!')
});