var karmaFiles = require('test-runner-config').getKarmaFiles(require('./testFiles'));

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    preprocessors: {
      'src/jasmine-mox-matchers.js': ['coverage']
    },
    files: karmaFiles.files,
    exclude: karmaFiles.exclude,
    reporters: ['progress', 'coverage'],
    port: 8080,
    runnerPort: 9100,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['PhantomJS'],
    captureTimeout: 5000,
    singleRun: true,
    coverageReporter: {
      dir: 'coverage',
      subdir: '.',
      reporters: [
        { type: 'lcov' },
        { type: 'text-summary' }
      ],
      check: {
        each: {
          statements: 97,
          branches: 80,
          functions: 100,
          lines: 97
        }
      }
    }
  });
};
