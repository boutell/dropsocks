var express = require('express');
var app = express();
app.use(require('connect-multiparty')());
var uploads = process.env.HOME + '/Uploads';
var slugify = require('sluggo');
var fs = require('fs');
var network = require('network');

if (!fs.existsSync(uploads)) {
  fs.mkdirSync(uploads);
}

app.post('/', function(req, res) {
  console.log(req.files);
  if (!req.files.file) {
    return res.status(400).send('bad request');
  }
  var name = req.files.file.name;
  var path = req.files.file.path;
  console.log(name);
  var matches = name.match(/([^\/]+)\.([^\.]+$)/);
  if (!matches) {
    return res.status(400).send('bad request');
  }
  name = matches[1];
  name = slugify(name);
  var ext = matches[2];
  ext = ext.toLowerCase();
  fs.rename(path, uploads + '/' + name + '.' + ext);
  return res.redirect('/?accepted=1');
});

app.get('/', function(req, res) {
  res.send(
`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">  
  <title>dropsocks</title>
</head>
<body>
  <h1>dropsocks</h1>
  <form method="POST" enctype="multipart/form-data" action="/">
    <input type="file" name="file" />
    <input type="submit" value="Upload" />
  </form>
  ${ req.query.accepted ? "<h2>Thanks.</h2>" : "" }
</body>
</html>
`
  );
});

var port = process.env.PORT ? parseInt(process.env.PORT) : 9876;

app.listen(port);

network.get_active_interface(function(err, obj) {
  if (err) {
    console.log('Not sure what my IP address is, but go to http://something:' + port);
  } else {
    console.log('http://' + obj.ip_address + ':' + port);
  }
});
  
