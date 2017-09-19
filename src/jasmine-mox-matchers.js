import _ from 'lodash';

let currentSpec;
const isJasmine2 = /^2/.test(jasmine.version);

beforeEach(function () {
  currentSpec = this;
});

const messages = {};

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
function format(str, ...args) {
  return args.reduce((msg, arg, i) => msg.replace(new RegExp(`\\{${i}\\}`, 'g'), jasmine.pp(arg)), str);
}

/**
 * Create a jasmine 2 matcher result
 * @param {string} matcherName
 * @param {Boolean} pass
 * @param {...string} message
 * @returns {{pass: boolean, message: string}}
 */
function getResult(matcherName, pass, ...messageWithPlaceholderValues) {
  const formattedMessage = format.apply(this, messageWithPlaceholderValues);
  messages[matcherName] = formattedMessage; // Save {not} message for later use
  return {
    pass,
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
    throw Error(`${jasmine.pp(actual)} is not a promise`);
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
  const success = jasmine.createSpy('Promise success callback');
  const failure = jasmine.createSpy('Promise failure callback');

  actual.then(success, failure);
  createScope().$digest();

  const spy = verb === 'resolved' ? success : failure;
  let pass = false;
  let message = `Expected promise to have been ${verb} with ${jasmine.pp(expected)} but it was not ${verb} at all`;

  if (isJasmine2 ? spy.calls.any() : spy.calls.length) {
    const actualResult = isJasmine2 ? spy.calls.mostRecent().args[0] : spy.mostRecentCall.args[0];
    if (angular.isFunction(expected)) {
      expected(actualResult);
      pass = true;
    } else {
      pass = angular.equals(actualResult, expected);
    }

    message = `Expected promise {not} to have been ${verb} with ${jasmine.pp(expected)} but was ${verb} with \
${jasmine.pp(actualResult)}`;
  }

  return getResult(`to${verb === 'resolved' ? 'Resolve' : 'Reject'}With`, pass, message);
}

/*
 * Tests if a given object is a promise object.
 * The Promises/A spec (http://wiki.commonjs.org/wiki/Promises/A) only says it must have a
 * function 'then', so, I guess we'll go with that for now.
 */
function toBePromise() {
  return {
    compare(actual) {
      const pass = isPromise(actual);
      return getResult('toBePromise', pass, 'Expected {0} {not} to be a promise', actual);
    }
  };
}

/*
 * Asserts whether the actual promise object resolves
 */
function toResolve() {
  return {
    compare(actual) {
      assertPromise(actual);
      const success = jasmine.createSpy('Promise success callback');
      actual.then(success, angular.noop);
      createScope().$digest();

      const pass = isJasmine2 ? success.calls.any() : success.calls.length > 0;
      const message = 'Expected promise {not} to have been resolved';
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
    compare(actual, expected) {
      return createPromiseWith(actual, expected, 'resolved');
    }
  };
}

/*
 * Asserts whether the actual promise object is rejected
 */
function toReject() {
  return {
    compare(actual) {
      assertPromise(actual);
      const failure = jasmine.createSpy('Promise failure callback');
      actual.then(angular.noop, failure);
      createScope().$digest();
      const pass = isJasmine2 ? failure.calls.any() : failure.calls.length > 0;

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
    compare(actual, expected) {
      return createPromiseWith(actual, expected, 'rejected');
    }
  };
}

function toHaveQueryParams() {
  function queryStringFilter(str) {
    return str
      .replace(/(^\?)/, '')
      .split('&')
      .reduce((params, n) => {
        const [key, value] = n.split('=');
        return { ...params, [key]: value };
      }, {});
  }

  return {
    compare(actual, expected, strict) {
      const actualParams = queryStringFilter(actual.substring(actual.indexOf('?')));
      const pass = _.matches(expected)(actualParams) && (!strict || _.matches(actualParams)(expected));
      return getResult('toHaveQueryParams', pass, 'Expected URI {not} to have params {0}, actual params were {1} ' +
        'in {2}', expected, actualParams, actual);
    }
  };
}

function toContainIsolateScope() {
  return {
    compare(actual, expected) {
      let cleanedScope;
      let pass;
      let messagePostfix;
      if (actual.isolateScope()) {
        cleanedScope = {};
        angular.forEach(actual.isolateScope(), (val, key) => {
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

      return getResult('toContainIsolateScope', pass, `Expected element isolate scope {not} to contain {0} but \
${messagePostfix}`, expected, cleanedScope);
    }
  };
}

function convertMatchers(matchers) {
  const jasmine1Matchers = {};
  angular.forEach(matchers, (matcher, name) => {
    function matcherFactory(compareFn) {
      return function (...args) {
        const result = compareFn.apply(this, [this.actual].concat(args));
        this.message = convertMessage(messages[name]);
        return result.pass;
      };
    }
    jasmine1Matchers[name] = matcherFactory(matcher().compare);
  });
  return jasmine1Matchers;
}

const matchers = {
  toBePromise,
  toHaveBeenResolved: toResolve,
  toResolve,
  toResolveWith,
  toHaveBeenResolvedWith: toResolveWith,
  toReject,
  toRejectWith,
  toHaveBeenRejected: toReject,
  toHaveBeenRejectedWith: toRejectWith,
  toHaveQueryParams,
  toContainIsolateScope
};

const JasmineMoxMatchers = {
  v1: convertMatchers(matchers),
  v2: matchers
};

export default JasmineMoxMatchers;
