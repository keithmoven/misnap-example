var assert = require('assert');
var fs = require('fs');
var bunyan = require('super-bunyan');
var logger = bunyan.createLogger({name: 'testMisnapResponseTransformer', level: 'debug'});
var MisnapService = require('../MisnapService');


describe('MisnapService', function() {

  describe('#constructor()', function () {
    it('should create an object', function () {
      var misnapService = new MisnapService(logger);
      assert(misnapService !== null, "object expected, but null returned");
    });
  });
  describe('#constructor()', function () {
    it('should throw an Error if logger is not passed', function () {
      try {
        new MisnapService();
        assert.fail("no error", "error", "expected an error to be thrown");
      } catch (err) {
        // expected
        assert(true);
      }
    });
  });
  describe('#sendRequest()', function () {
    this.timeout(10000);
    it('should send the request without ESF to mitek', function (done) {
      var request = fs.readFileSync('./test/goodRequestWithoutESF.xml').toString();
      var misnapService = new MisnapService(logger);
      misnapService.sendRequest(request)
        .then(function(result) {
          console.log(result);
          done();
        });
    });
    it('should send the request with ESF to mitek', function (done) {
      var request = fs.readFileSync('./test/goodRequestWithESF.xml').toString();
      var misnapService = new MisnapService(logger);
      misnapService.sendRequest(request)
        .then(function(result) {
          console.log(result);
          done();
        });
    });
  });
});
