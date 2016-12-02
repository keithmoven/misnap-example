var express = require('express');
var bodyParser = require('body-parser');
var bunyan = require('super-bunyan');
var logger = bunyan.createLogger({name: 'test_server', level: 'debug'});
var MisnapService = require('./MisnapService');
var service = new MisnapService(logger);
var app = express();
var PORT = 3000;

app.use(bodyParser.json({limit: '10mb'}));

app.get('/', function (req, res) {
  console.log('GET /');
  res.send("<html><body>Driver's License Verification Server</body></html>");
});

app.post('/', function (req, res) {
  console.log('POST / ');
  // TODO: add stronger validation (not null, not empty, etc)
  if (!(req.body && req.body.driversLicenseFront
    && req.body.driversLicenseBack && req.body.mibiData)) {
    res.status(400).send('request body not properly formed');
  }
  else
  {
  service.verify(req.body.driversLicenseFront, req.body.driversLicenseBack, req.body.mibiData)
    .then(function(result) {
      res.send(result);
    });
  }
});

// HTTP server
app.listen(PORT, function () {
  console.log("HTTP server listening on port " + PORT);
});
