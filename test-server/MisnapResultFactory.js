function createEmptyMisnapResult() {
  return {status: null, errors: [], dataMatchScore: 0,
    verification: null, isDriversLicenseValidWithMoven: false};
}

function createMisnapResultWithError(err) {
  var result = createEmptyMisnapResult();
  result.errors.push({errorCode: 0, errorMessage: JSON.stringify(err)});
  return result;
}

module.exports = {
  createEmptyMisnapResult: createEmptyMisnapResult,
  createMisnapResultWithError: createMisnapResultWithError
};