/* jshint strict:false */

var currentSpec;
beforeEach(function () {
  currentSpec = this;
});

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
 * Return function returns message and inverted (.not) message
 * @param {...string} msg message with {not} to be replaced by nothing or 'not' and {#} to be replaced by additional parameters
 * @returns {Function}
 */
function getMessages() {
  var args = arguments;
  var formattedMsg = format.apply(this, args);
  return function () {
    return [
      formattedMsg.replace(' {not}', ''),
      formattedMsg.replace('{not}', 'not')
    ];
  };
}

/**
 * Helper function to create returns for jasmine matchers
 *
 * @param {Function} spy function (callback)
 * @param {*} expected value to match agains
 * @param {string} verb 'rejected' or 'resolved'
 * @returns {boolean}
 */
function createPromiseWith(spy, expected, verb) {
  createScope().$digest();
  if (spy.callCount) {
    var actualResult = spy.mostRecentCall.args[0];
    this.message = getMessages('Expected promise {not} to have been ' + verb + ' with {0} but was ' + verb + ' with {1}', expected, actualResult);
    if (_.isFunction(expected)) {
      expected(actualResult);
      return spy.calls.length > 0;
    } else {
      return angular.equals(actualResult, expected);
    }
  } else {
    this.message = getMessages('Expected promise {not} to have been ' + verb + ' with {0} but was not ' + verb + ' at all', expected);
    return false;
  }
}

/*
 * Asserts whether the actual promise object resolves
 */
function toResolve() {
  var success = jasmine.createSpy('Promise success callback');
  this.actual.then(success, angular.noop);
  createScope().$digest();

  this.message = getMessages('Expected promise {not} to have been resolved');

  return success.calls.length > 0;
}

/*
 * Asserts whether the actual promise object resolves with the given expected object, using angular.equals.
 * If expected is a method, it will assert whether the promise object was resolved, and execute the callback
 * with the response object, so that the spec can do its own assertions. Useful for more complex data.
 */
function toResolveWith(expected) {
  var success = jasmine.createSpy('Promise success callback');
  this.actual.then(success);
  return createPromiseWith.call(this, success, expected, 'resolved');
}

/*
 * Asserts whether the actual promise object is rejected
 */
function toReject() {
  var failure = jasmine.createSpy('Promise failure callback');

  this.actual.catch(failure);
  createScope().$digest();

  this.message = getMessages('Expected promise {not} to have been rejected');

  return failure.calls.length > 0;
}

/*
 * Asserts whether the actual promise object rejects with the given expected object, using angular.equals.
 * If expected is a method, it will assert whether the promise object was rejected, and execute the callback
 * with the response object, so that the spec can do its own assertions. Useful for more complex data.
 */
function toRejectWith(expected) {
  var failure = jasmine.createSpy('Promise failure callback');

  this.actual.catch(failure);
  return createPromiseWith.call(this, failure, expected, 'rejected');
}

var matchers = {
  /*
   * Tests if a given object is a promise object.
   * The Promises/A spec (http://wiki.commonjs.org/wiki/Promises/A) only says it must have a
   * function 'then', so, I guess we'll go with that for now.
   */
  toBePromise: function toBePromise() {
    this.message = getMessages('Expected object {0} to be a promise', this.actual);
    return this.actual && _.isFunction(this.actual.then);
  },
  toResolve: toResolve,
  toResolveWith: toResolveWith,
  toHaveBeenResolved: toResolve,
  toHaveBeenResolvedWith: toResolveWith,
  toReject: toReject,
  toRejectWith: toRejectWith,
  toHaveBeenRejected: toReject,
  toHaveBeenRejectedWith: toRejectWith,
  toContainIsolateScope: function toContainIsolateScope(values) {
    var cleanedScope = {};
    _.each(this.actual.isolateScope(), function (val, key) {
      if (key !== 'this' && key.charAt(0) !== '$') {
        cleanedScope[key] = val;
      }
    });
    this.message = getMessages('Expected element isolated scope {not} to contain {0} but got {1}', values, cleanedScope);
    return _.isEqual(_.pick(cleanedScope, _.keys(values)), values);
  }
};

beforeEach(function () {
  this.addMatchers(matchers);
});
