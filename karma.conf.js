var karmaFiles = require('test-runner-config').getKarmaFiles(require('./testFiles'));

module.exports = function (config) {
  config.set({
    frameworks: ['jasmine'],
    preprocessors: {
      'src/jasmine-mox-matchers.js': ['coverage']
    },
    files: karmaFiles.files,
    exclude: karmaFiles.exclude,
    reporters: ['progress', 'coverage'],
    logLevel: config.LOG_INFO,
    browsers: ['PhantomJS'],
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
