var fs = require('fs');
var request = require('request');
var P = require('bluebird');
var MisnapResponseTransformer = require('./MisnapResponseTransformer');
var createMisnapResultWithError = require('./MisnapResultFactory').createMisnapResultWithError;

var MITEK_SERVER = 'https://s01.cloud-xip.miteksystems.com/Plugins/ProductServices.PhotoVerify/services/v1.0/PhotoVerifyService.svc';
var DRIVERS_LICENSE_REQUEST_VERIFY_TEMPLATE
  = fs.readFileSync('./driversLicenseVerifyRequest.xml').toString();

var MisnapService = function(logger) {
  if (!logger) {
    throw new Error('logger is required');
  }
  this.logger = logger;
  this.transformer = new MisnapResponseTransformer(logger);
}

MisnapService.prototype.verify = function(driversLicenseFront, driversLicenseBack, mibiData) {
  var verifyRequest =
    DRIVERS_LICENSE_REQUEST_VERIFY_TEMPLATE.replace('${driversLicenseFront}', driversLicenseFront);
  var encodedBack = new Buffer(driversLicenseBack).toString('base64');
  verifyRequest = verifyRequest.replace('${driversLicenseBack}', encodedBack);
  var hackedMibi = JSON.parse(mibiData);
  if (!hackedMibi.MiSnapResultCode) hackedMibi.MiSnapResultCode = "SuccessVideo";
  convertIntegerPropertiesToString(hackedMibi);
  if (hackedMibi.Parameters) convertIntegerPropertiesToString(hackedMibi.Parameters);
  verifyRequest = verifyRequest.replace('${mibiData}', JSON.stringify(hackedMibi));
  return this.sendRequest(verifyRequest);
}

function convertIntegerPropertiesToString(object) {
  for (var property in object) {
    if (object.hasOwnProperty(property)) {
       if (Number.isInteger(object[property])) {
          console.log('converting ' + property + ' to string, value: ' + object[property]);
      	object[property] = object[property].toString();
      }
    }
  }  
}
// send request was split out because it makes it easier to test
MisnapService.prototype.sendRequest = function(verifyRequest) {
  console.log('sendRequest');
  fs.writeFileSync('request.xml', verifyRequest, 'utf8');
  var self = this;

  return new P(function (resolve, reject) {
    request({
      url: MITEK_SERVER,
      method: "POST",
      headers: {
        "Content-Type": "text/xml",
        "SOAPAction": "http://tempuri.org/IPhotoVerifyService/Verify"
      },
      body: verifyRequest
    }, function(err, httpResponse, body){
      if (err) console.log('err: ' + JSON.stringify(err));
      //console.log('httpResponse: ' + JSON.stringify(httpResponse));
      //console.log('body: ' + JSON.stringify(body));
      if (err) {
        reject(err);
      } else {
        if (httpResponse.statusCode != 200) {
          reject('httpStatusCode is ' + httpResponse.statusCode + ', expected 200');
        }  
        fs.writeFileSync('response.xml', body, 'utf8');
        return resolve(body);
      }
    });
  })
    .then(function (body) {
      //console.log('sendRequest body');
      return self.transformer.transform(body);
    })
    .catch(function (err) {
      console.log('sendRequest err');
      return createMisnapResultWithError(err);
    });
}

module.exports = MisnapService;
