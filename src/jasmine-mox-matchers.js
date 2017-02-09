/* jshint strict:false */

var
  currentSpec,
  isJasmine2 = /^2/.test(jasmine.version),
  jasmineV1MoxMatchers,
  jasmineV2MoxMatchers;

beforeEach(function () {
  currentSpec = this;
});

(function () {

  var messages = {};

  /**
   * Helper function copied from Mox
   * @returns {Scope}
   */
  function createScope() {
    return currentSpec.$injector.get('$rootScope').$new();
  }

  /**
   * Format a str, replacing {NUMBER} with the n'th argument
   * and uses jasmine.pp for formatting the arguments
   * @param {...string} str message with {#} to be replaced by additional parameters
   * @returns {string}
   */
  function format(str) {
    var message = str;
    for (var i = 1; i < arguments.length; i++) {
      message = message.replace(new RegExp('\\{' + (i - 1) + '\\}', 'g'), jasmine.pp(arguments[i]));
    }
    return message;
  }

  /**
   * Create a jasmine 2 matcher result
   * @param {string} matcherName
   * @param {Boolean} pass
   * @param {...string} message
   * @returns {{pass: boolean, message: string}}
   */
  function getResult(matcherName, pass) {
    var messageWithPlaceholderValues = Array.prototype.slice.call(arguments, 2);
    var formattedMessage = format.apply(this, messageWithPlaceholderValues);
    messages[matcherName] = formattedMessage; // Save {not} message for later use
    return {
      pass: pass,
      message: formattedMessage.replace(' {not}', pass ? ' not' : '')
    };
  }

  /**
   * Convert a {not} message to a function that returns message and inverted (.not) message, for jasmine 1 matcher.
   * @param {...string} message with {not} to be replaced by nothing or 'not' to be replaced by additional parameters
   * @returns {Function}
   */
  function convertMessage(message) {
    return function () {
      return [
        message.replace(' {not}', ''),
        message.replace('{not}', 'not')
      ];
    };
  }

  function isPromise(actual) {
    return !!actual && angular.isFunction(actual.then);
  }

  function assertPromise(actual) {
    if (!isPromise(actual)) {
      throw Error(jasmine.pp(actual) + ' is not a promise');
    }
  }

  /**
   * Helper function to create returns for to...With matchers
   *
   * @param {*} actual the test subject
   * @param {*} expected value to match against
   * @param {string} verb 'rejected' or 'resolved'
   * @returns {boolean}
   */
  function createPromiseWith(actual, expected, verb) {
    assertPromise(actual);
    var success = jasmine.createSpy('Promise success callback');
    var failure = jasmine.createSpy('Promise failure callback');

    actual.then(success, failure);
    createScope().$digest();

    var spy = verb === 'resolved' ? success : failure;

    var
      pass = false,
      message = 'Expected promise to have been ' + verb + ' with ' + jasmine.pp(expected) + ' but it was not ' + verb + ' at all';

    if (isJasmine2 ? spy.calls.any() : spy.calls.length) {
      var actualResult = isJasmine2 ? spy.calls.mostRecent().args[0] : spy.mostRecentCall.args[0];
      if (angular.isFunction(expected)) {
        expected(actualResult);
        pass = true;
      } else {
        pass = angular.equals(actualResult, expected);
      }

      message = 'Expected promise {not} to have been ' + verb + ' with ' + jasmine.pp(expected) + ' but was ' + verb + ' with ' + jasmine.pp(actualResult);
    }

    return getResult('to' + (verb === 'resolved' ? 'Resolve' : 'Reject') + 'With', pass, message);
  }

  /*
   * Tests if a given object is a promise object.
   * The Promises/A spec (http://wiki.commonjs.org/wiki/Promises/A) only says it must have a
   * function 'then', so, I guess we'll go with that for now.
   */
  function toBePromise() {
    return {
      compare: function compareToBePromise(actual) {
        var pass = isPromise(actual);
        return getResult('toBePromise', pass, 'Expected {0} {not} to be a promise', actual);
      }
    };
  }

  /*
   * Asserts whether the actual promise object resolves
   */
  function toResolve() {
    return {
      compare: function compareToResolve(actual) {
        assertPromise(actual);
        var success = jasmine.createSpy('Promise success callback');
        actual.then(success, angular.noop);
        createScope().$digest();

        var pass = isJasmine2 ? success.calls.any() : success.calls.length > 0;
        var message = 'Expected promise {not} to have been resolved';
        return getResult('toResolve', pass, message);
      }
    };
  }

  /*
   * Asserts whether the actual promise object resolves with the given expected object, using angular.equals.
   * If expected is a method, it will assert whether the promise object was resolved, and execute the callback
   * with the response object, so that the spec can do its own assertions. Useful for more complex data.
   */
  function toResolveWith() {
    return {
      compare: function compareToResolveWith(actual, expected) {
        return createPromiseWith(actual, expected, 'resolved');
      }
    };
  }

  /*
   * Asserts whether the actual promise object is rejected
   */
  function toReject() {
    return {
      compare: function compareToReject(actual) {
        assertPromise(actual);
        var failure = jasmine.createSpy('Promise failure callback');
        actual.then(angular.noop, failure);
        createScope().$digest();
        var pass = isJasmine2 ? failure.calls.any() : failure.calls.length > 0;

        return getResult('toReject', pass, 'Expected promise {not} to have been rejected');
      }
    };
  }

  /*
   * Asserts whether the actual promise object rejects with the given expected object, using angular.equals.
   * If expected is a method, it will assert whether the promise object was rejected, and execute the callback
   * with the response object, so that the spec can do its own assertions. Useful for more complex data.
   */
  function toRejectWith() {
    return {
      compare: function compareToRejectWith(actual, expected) {
        return createPromiseWith(actual, expected, 'rejected');
      }
    };
  }

  function toHaveQueryParams() {
    function queryStringFilter(str) {
      var params = {};
      return str
        .replace(/(^\?)/, '')
        .split('&')
        .map(function (n) {
          n = n.split('=');
          params[n[0]] = n[1];
          return params;
        })[0];
    }

    return {
      compare: function compareToHaveQueryParams(actual, expected, strict) {
        var actualParams = queryStringFilter(actual.substring(actual.indexOf('?')));
        var pass = _.matches(expected)(actualParams) && (!strict || _.matches(actualParams)(expected));
        return getResult('toHaveQueryParams', pass, 'Expected URI {not} to have params {0}, actual params were {1} in {2}', expected, actualParams, actual);
      }
    };

  }

  function toContainIsolateScope() {
    return {
      compare: function compareToContainIsolateScope(actual, expected) {
        var cleanedScope, pass, messagePostfix;
        if (actual.isolateScope()) {
          cleanedScope = {};
          angular.forEach(actual.isolateScope(), function cleanScope(val, key) {
            if (key !== 'this' && key.charAt(0) !== '$') {
              cleanedScope[key] = val;
            }
          });

          pass = _.isEqual(_.pick(cleanedScope, _.keys(expected)), expected);
          messagePostfix = 'got {1}';
        } else {
          pass = false;
          messagePostfix = 'the expected element has no isolate scope';
        }

        return getResult('toContainIsolateScope', pass, 'Expected element isolate scope {not} to contain {0} but ' + messagePostfix, expected, cleanedScope);
      }
    };
  }

  function convertMatchers(matchers) {
    var jasmine1Matchers = {};
    angular.forEach(matchers, function convertMatcher(matcher, name) {
      var newMatcher = function matcherFactory(compareFn) {
        return function convertedJasmineMatcher() {
          var args = [this.actual].concat(Array.prototype.slice.call(arguments, 0));
          var result = compareFn.apply(this, args);
          this.message = convertMessage(messages[name]);
          return result.pass;
        };
      };
      jasmine1Matchers[name] = newMatcher(matcher().compare);
    });
    return jasmine1Matchers;
  }

  jasmineV2MoxMatchers = {
    toBePromise: toBePromise,
    toHaveBeenResolved: toResolve,
    toResolve: toResolve,
    toResolveWith: toResolveWith,
    toHaveBeenResolvedWith: toResolveWith,
    toReject: toReject,
    toRejectWith: toRejectWith,
    toHaveBeenRejected: toReject,
    toHaveBeenRejectedWith: toRejectWith,
    toHaveQueryParams: toHaveQueryParams,
    toContainIsolateScope: toContainIsolateScope
  };

  jasmineV1MoxMatchers = convertMatchers(jasmineV2MoxMatchers);
  beforeEach(function () {
    if (isJasmine2) {
      jasmine.addMatchers(jasmineV2MoxMatchers);
    } else {
      this.addMatchers(jasmineV1MoxMatchers);
    }
  });
})();
