module.exports = function () {
  function n(file) { return { pattern: file, instrument: false }; }

  return {
    //testFramework: 'jasmine@1.3.1',

    files: [
      n('bower_components/lodash/lodash.js'),
      n('bower_components/angular/angular.js'),
      n('bower_components/angular-mocks/angular-mocks.js'),
      n('bower_components/testception/src/testception.js'),
      'src/jasmine-mox-matchers-2.x.js'
    ],
    tests: [
      'test/spec/matchers-spec.js'
    ]
  };
};
