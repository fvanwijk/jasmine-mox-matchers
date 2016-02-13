module.exports = [
  {
    type: 'lib',
    files: [
      'node_modules/lodash/lodash.js',
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/testception/src/testception.js'
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
      'test/spec/matchers-spec.js'
    ]
  }
];
