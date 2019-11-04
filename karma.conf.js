const path = require('path');

module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    preprocessors: {
      'src/jasmine-mox-matchers.spec.js': ['webpack']
    },
    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'src/jasmine-mox-matchers.spec.js'
    ],
    webpack: {
      mode: 'none',
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
          },
          {
            test: /\.js$/,
            use: {
              loader: 'istanbul-instrumenter-loader',
              options: { esModules: true }
            },
            include: path.resolve('src/')
          }
        ]
      }
    },
    reporters: ['progress', 'coverage-istanbul'],
    logLevel: config.LOG_INFO,
    browsers: ['jsdom'],
    singleRun: true,
    coverageIstanbulReporter: {
      dir: 'coverage',
      subdir: '.',
      reports: ['html', 'text-summary', 'lcov'],
      thresholds: {
        each: {
          statements: 100,
          branches: 83,
          functions: 100,
          lines: 100
        }
      }
    }
  });
};
