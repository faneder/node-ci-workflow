var express = require('express');
var app     = express();

app.use('/', express.static(__dirname + '/eder_portfolio'));
app.use('/tebuy', express.static(__dirname + '/tebuy'));

app.use(function(req, res, next) {
  res.status(404);
  res.type('txt').send('Not found');
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
