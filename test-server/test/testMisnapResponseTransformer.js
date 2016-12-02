var assert = require('assert');
var fs = require('fs');
var bunyan = require('super-bunyan');
var logger = bunyan.createLogger({name: 'testMisnapResponseTransformer', level: 'debug'});
var MisnapResponseTransformer = require('../MisnapResponseTransformer');


describe('MisnapResponseTransformer', function() {

  describe('#constructor()', function () {
    it('should create an object', function () {
      var transformer = new MisnapResponseTransformer(logger);
      assert(transformer !== null, "object expected, but null returned");
    });
  });
  describe('#constructor()', function () {
    it('should throw an Error if logger is not passed', function () {
      try {
        new MisnapResponseTransformer();
        assert.fail("no error", "error", "expected an error to be thrown");
      } catch (err) {
        // expected
        assert(true);
      }
    });
  });
  describe('#transform()', function () {
    it('should transform a good response with errors', function () {
      var response = fs.readFileSync('./test/goodResponseWithErrors.xml').toString();
      var transformer = new MisnapResponseTransformer(logger);
      transformer.transform(response)
        .then(function(result) {
          console.log(result);
        });
    });
    it('should transform a good response with success but no ESF', function () {
      var response = fs.readFileSync('./test/goodResponseSuccessNoESF.xml').toString();
      var transformer = new MisnapResponseTransformer(logger);
      transformer.transform(response)
        .then(function(result) {
          console.log(result);
        });
    });
    it('should transform a good response with success and ESF', function () {
      var response = fs.readFileSync('./test/goodResponseSuccessWithESF.xml').toString();
      var transformer = new MisnapResponseTransformer(logger);
      transformer.transform(response)
        .then(function(result) {
          console.log(result);
        });
    });
  });
});
