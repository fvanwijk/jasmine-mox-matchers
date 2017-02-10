module.exports = function (config) {
  config.set({
    frameworks: ['jasmine'],
    preprocessors: {
      'src/jasmine-mox-matchers.js': ['coverage'],
      'src/jasmine-mox-matchers.spec.js': ['webpack']
    },
    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'src/jasmine-mox-matchers.spec.js'
    ],
    webpack: {
      module: {
        loaders: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
          },
          {
            test: /jasmine-mox-matchers\.js$/,
            include: /src/,
            loader: 'isparta-loader'
          }
        ]
      }
    },
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
