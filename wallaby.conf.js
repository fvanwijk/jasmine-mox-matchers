const wallabyWebpack = require('wallaby-webpack');

const webpackPostprocessor = wallabyWebpack({});

module.exports = function (wallaby) {
  return {
    // testFramework: 'jasmine@1.3.1',
    compilers: {
      'src/*.js': wallaby.compilers.babel()
    },
    postprocessor: webpackPostprocessor,

    bootstrap() {
      window.__moduleBundler.loadTests();
    },
    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      { pattern: 'src/jasmine-mox-matchers.js', load: false }
    ],
    tests: [
      { pattern: 'src/jasmine-mox-matchers.spec.js', load: false }
    ]
  };
};
