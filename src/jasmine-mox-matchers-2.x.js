/* jshint strict:false */

var currentSpec;
beforeEach(function () {
  currentSpec = this;
});

var jasmineMoxMatchers;

(function () {

  /**
   * Helper function copied from Mox
   * @returns {Scope}
   */
  function createScope() {
    return currentSpec.$injector.get('$rootScope').$new();
  }

  function getNot(pass) {
    return pass ? ' not' : '';
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
   * Create a matcher result
   * @param {Boolean} pass
   * @param {...string} message
   * @returns {{pass: boolean, message: string}}
   */
  function getResult(pass) {
    var args = Array.prototype.slice.call(arguments, 1);
    return {
      pass: pass,
      message: format.apply(this, args)
    };
  }

  /**
   * Helper function to create returns for jasmine matchers
   *
   * @param {Object} spy function (callback)
   * @param {*} expected value to match against
   * @param {string} verb 'rejected' or 'resolved'
   * @returns {boolean}
   */
  function createPromiseWith(spy, expected, verb) {
    createScope().$digest();

    var
      pass = false,
      message = 'Expected promise to have been ' + verb + ' with ' + jasmine.pp(expected) + ' but it was not ' + verb + ' at all';

    if (spy.calls.count()) {
      var actualResult = spy.calls.mostRecent().args[0];
      if (angular.isFunction(expected)) {
        console.log(expected, actualResult);
        expected(actualResult);
        pass = spy.calls.any();
      } else {
        pass = angular.equals(actualResult, expected);
      }

      message = 'Expected promise' + getNot(pass) + ' to have been ' + verb + ' with ' + jasmine.pp(expected) + ' but was ' + verb + ' with ' + jasmine.pp(actualResult);
    }

    return getResult(pass, message);
  }

  /*
   * Asserts whether the actual promise object resolves
   */
  function toResolve() {
    return {
      compare: function (actual) {
        var success = jasmine.createSpy('Promise success callback');
        actual.then(success);
        createScope().$digest();

        var pass = success.calls.count() > 0;
        var message = 'Expected promise' + getNot(pass) + ' to have been resolved';
        return getResult(pass, message);
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
      compare: function (actual, expected) {
        var success = jasmine.createSpy('Promise success callback');

        actual.then(success);
        return createPromiseWith(success, expected, 'resolved');
      }
    };
  }

  /*
   * Asserts whether the actual promise object is rejected
   */
  function toReject() {
    return {
      compare: function (actual) {
        var failure = jasmine.createSpy('Promise failure callback');
        actual.catch(failure);
        createScope().$digest();

        var pass = failure.calls.any();

        return getResult(pass, 'Expected promise' + getNot(pass) + ' to have been rejected');
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
      compare: function (actual, expected) {
        var failure = jasmine.createSpy('Promise failure callback');

        actual.catch(failure);

        return createPromiseWith(failure, expected, 'rejected');
      }
    };
  }

  jasmineMoxMatchers = {
    // tests if a given object is a promise object.
    // The Promises/A spec (http://wiki.commonjs.org/wiki/Promises/A) only says it must have a
    // function 'then', so, I guess we'll go with that for now.
    toBePromise: function toBePromise() {
      return {
        compare: function (actual) {
          var pass = !!actual && angular.isFunction(actual.then);
          return {
            pass: pass,
            message: format('Expected {0}' + getNot(pass) + ' to be a promise', actual)
          };
        }
      };
    },
    toResolve: toResolve,
    toResolveWith: toResolveWith,
    toHaveBeenResolved: toResolve,
    toHaveBeenResolvedWith: toResolveWith,
    toReject: toReject,
    toRejectWith: toRejectWith,
    toHaveBeenRejected: toReject,
    toHaveBeenRejectedWith: toRejectWith,
    toContainIsolateScope: function () {
      return {
        compare: function (actual, expected) {
          var cleanedScope, pass, messagePostfix;
          if (actual.isolateScope()) {
            cleanedScope = {};
            angular.forEach(actual.isolateScope(), function (val, key) {
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

          return {
            pass: pass,
            message: format('Expected element isolate scope' + getNot(pass) + ' to contain {0} but ' + messagePostfix, expected, cleanedScope)
          };
        }
      };
    }
  };

  beforeEach(function () {
    jasmine.addMatchers(jasmineMoxMatchers);
  });
})();
