module.exports = [
  {
    type: 'lib',
    files: [
      'node_modules/lodash/lodash.js',
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/testception/dist/testception.min.js'
    ]
  },
  {
    type: 'src',
    files: [
      'src/jasmine-mox-matchers.js'
    ]
  },
  {
    type: 'specs',
    files: [
      'src/jasmine-mox-matchers.spec.js'
    ]
  }
];