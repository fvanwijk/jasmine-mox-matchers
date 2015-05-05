/**
 * The matchers can be tested by just using them. This will only test positive cases, but we also want to test the cases where the matcher is failing.
 * Beside that, we also want to test the matchers that are made for another Jasmine version than the Jasmine version used in this project.
 * Therefore we need to test all matchers in a more technical way, eg. just how Jasmine tests its own matchers:
 * https://github.com/jasmine/jasmine/tree/master/spec/core/matchers
 */

/**
 * DSL for testing matchers.
 * TODO: extract to separate Github project
 * @param {Object} matcher to test
 * @returns test
 */
function expectMatcher(matcher) {
  function runTest() {
    expect(test.matcher().compare(test.actual, test.expected))
      .toEqual({ pass: test.pass, message: test.message });
  }

  var test = {
    matcher: matcher
  };

  test.withActual = function (actual) {
    test.actual = actual;
    return test;
  };

  test.andExpected = function (expected) {
    test.expected = expected;
    return test;
  };

  test.toPass = function () {
    test.pass = true;
    return test;
  };

  test.toFail = function () {
    test.pass = false;
    return test;
  };

  test.withMessage = function (message) {
    test.message = message;

    runTest();

    return test;
  };

  test.withSameMessage = function () {
    runTest();
    return test;
  };

  return test;
}

describe('the promise matchers v2', function () {

  function useMatcher(matcherName) {
    beforeEach(function () {
      // TODO: do not depend on matchers global
      this.test = expectMatcher(matchers[matcherName]);
    });
  }

  var $q, $rootScope;

  beforeEach(inject(function (_$q_) {
    $q = _$q_;
  }));

  describe('theBePromise', function () {
    useMatcher('toBePromise');

    it('should assert an object with "then" method to be a promise', function () {
      this.test
        .withActual({ then: angular.noop })
        .toPass()
        .withMessage('Expected Object({ then: Function }) not to be a promise');
    });

    it('should assert a falsy actual not to be a promise', function () {
      this.test
        .withActual(undefined)
        .toFail()
        .withMessage('Expected undefined to be a promise');
    });

    it('should assert an object without "then" method not to be a promise', function () {
      this.test
        .withActual({})
        .toFail()
        .withMessage('Expected Object({  }) to be a promise');
    });
  });

  describe('toResolve', function () {

    useMatcher('toResolve');

    it('should assert promises that are resolved as resolved', function () {
      var def = $q.defer();
      def.resolve();

      this.test
        .withActual(def.promise)
        .andExpected(undefined)
        .toPass()
        .withMessage('Expected promise to have been resolved');
    });

    it('should assert non-resolving promises as not resolved', function () {
      this.test
        .withActual($q.defer().promise)
        .toFail()
        .withMessage('Expected promise to have been resolved');
    });

  });

  describe('toHaveBeenResolved', function () {
    it('is the same matcher as toResolve', function () {
      expect(matchers['toHaveBeenResolved']).toBe(matchers['toResolve'])
    });
  });

  describe('toResolveWith / toHaveBeenResolvedWith', function () {
    useMatcher('toResolveWith');

    it('should assert promises that are resolved with some value as resolved with that value', function () {
      var def = $q.defer();
      def.resolve('value');

      this.test
        .withActual(def.promise)
        .andExpected('value')
        .toPass()
        .withMessage('Expected promise not to have been resolved with \'value\' but was resolved with \'value\'');
    });

    it('should fail when the promise does not resolve', function () {
      this.test
        .withActual($q.defer().promise)
        .andExpected('value')
        .toFail()
        .withMessage('Expected promise to have been resolved with \'value\' but it was not resolved at all');
    });

    it('should fail when the promise resolves to another value than the expected value', function () {
      var def = $q.defer();
      def.resolve('value');

      this.test
        .withActual(def.promise)
        .andExpected('another value')
        .toFail()
        .withMessage('Expected promise to have been resolved with \'another value\' but was resolved with \'value\'');
    });

  });
});