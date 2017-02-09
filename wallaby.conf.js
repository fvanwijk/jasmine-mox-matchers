var wallabyFiles = require('test-runner-config').getWallabyFiles(require('./testFiles'));

module.exports = function () {
  return {
    //testFramework: 'jasmine@1.3.1',
    files: wallabyFiles.files,
    tests: wallabyFiles.tests
  };
};
