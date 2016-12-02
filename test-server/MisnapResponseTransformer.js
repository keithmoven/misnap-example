var P = require('bluebird');
var xml2js = P.promisifyAll(require('xml2js'));
var createEmptyMisnapResult = require('./MisnapResultFactory').createEmptyMisnapResult;

var MitekResponseTransformer = function(logger) {
  if (!logger) {
    throw new Error('logger is required');
  }
  this.logger = logger;
}

MitekResponseTransformer.prototype.transform = function(mitekSOAPResponse) {
  var self = this;
  var output = createEmptyMisnapResult();

  return xml2js.parseStringAsync(mitekSOAPResponse)
    .then(function (result) {
      var response = result['s:Envelope']['s:Body'][0]['PhotoVerifyBaseResponse'][0]['Response'][0];
      output.status = response['a:Status'][0];
      var comparisonResult = response['a:ComparisonResult'];
      if (comparisonResult[0] && comparisonResult[0]['a:DataMatchScore']) {
        output.dataMatchScore = comparisonResult[0]['a:DataMatchScore'][0];
        if (output.dataMatchScore >= 800) {
          output.isDriversLicenseValidWithMoven = true;
        }
      }
      var verification = response['a:Verification'];
      if (verification) {
        output.verification = verification[0]['a:VerificationResult'][0];
      }
      var errors = response['a:Errors'][0]['a:Error'];
      if (errors) {
        for (var i=0; i < errors.length; i++) {
          var error = errors[i];
          output.errors.push({
            errorCode: error['a:ErrorCode'][0],
            errorMessage: error['a:FullMessage'][0],
          });
        }
      }
    })
    .catch(function(err) {
      self.logger.error(err, 'error parsing mitekSOAPResponse with xml2js');
    })
    .then(function() {
      return output;
    });
}

module.exports = MitekResponseTransformer;