/**
 * This spec tests both jasmine 1 and 2 matchers, but is using Jasmine 2, so the lines where
 * there is a slight difference between Jasmine 1 and 2 in the matchers, are not tested for Jasmine 1.
 */
import expectMatcher from 'testception';
import JasmineMoxMatchers from './jasmine-mox-matchers';

describe('the promise matchers', () => {
  function useMatcher(matcherName, jasmineVersion) {
    beforeEach(() => {
      this.test = expectMatcher(JasmineMoxMatchers[`v${jasmineVersion}`][matcherName]);
    });
  }

  let $q;

  beforeEach(() => {
    inject((_$q_) => {
      $q = _$q_;
    });
  });

  angular.forEach([1, 2], function (version) {
    describe(`when using the Jasmine ${version} matcher`, () => {
      beforeAll(() => {
        expectMatcher.jasmineVersion = version;
      });

      describe('toBePromise', () => {
        useMatcher('toBePromise', version);

        it('should assert an object with "then" method to be a promise', () => {
          this.test
            .withActual({ then: angular.noop })
            .toPass()
            .withMessage('Expected Object({ then: Function }) not to be a promise');
        });

        it('should assert a falsy actual not to be a promise', () => {
          this.test
            .withActual(undefined)
            .toFail()
            .withMessage('Expected undefined to be a promise');
        });

        it('should assert an object without "then" method not to be a promise', () => {
          this.test
            .withActual({})
            .toFail()
            .withMessage('Expected Object({  }) to be a promise');
        });
      });

      describe('toResolve', () => {
        useMatcher('toResolve', version);

        it('should assert promises that are resolved as resolved', () => {
          this.test
            .withActual($q.resolve())
            .andExpected(undefined)
            .toPass()
            .withMessage('Expected promise not to have been resolved');
        });

        it('should assert non-resolving promises as not resolved', () => {
          this.test
            .withActual($q.defer().promise)
            .toFail()
            .withMessage('Expected promise to have been resolved');
        });

        it('should assert rejecting promises as not resolved', () => {
          this.test
            .withActual($q.reject())
            .toFail()
            .withMessage('Expected promise to have been resolved');
        });
      });

      describe('toResolveWith', () => {
        useMatcher('toResolveWith', version);

        it('should assert promises that are resolved with some value as resolved with that value', () => {
          const def = $q.defer();
          def.resolve('value');

          this.test
            .withActual(def.promise)
            .andExpected('value')
            .toPass()
            .withMessage('Expected promise not to have been resolved with \'value\' but was resolved with \'value\'');
        });

        it('should fail when the promise does not resolve', () => {
          this.test
            .withActual($q.defer().promise)
            .andExpected('value')
            .toFail()
            .withMessage('Expected promise to have been resolved with \'value\' but it was not resolved at all');
        });

        it('should pass when the expected value is a callback function and the promise resolves', () => {
          this.test
            .withActual($q.resolve('value'))
            .andExpected((res) => {
              expect(res).toEqual('value');
            })
            .toPass()
            .withMessage('Expected promise not to have been resolved with Function but was resolved with \'value\'');
        });

        it('should fail when the promise resolves to another value than the expected value', () => {
          this.test
            .withActual($q.resolve('value'))
            .andExpected('another value')
            .toFail()
            .withMessage('Expected promise to have been resolved with \'another value\' but was resolved with ' +
              '\'value\'');
        });
      });

      describe('toReject', () => {
        useMatcher('toReject', version);

        it('should assert promises that are rejected as rejected', () => {
          const def = $q.defer();
          def.reject();

          this.test
            .withActual(def.promise)
            .andExpected(undefined)
            .toPass()
            .withMessage('Expected promise not to have been rejected');
        });

        it('should assert non-resolving promises as not rejected', () => {
          this.test
            .withActual($q.defer().promise)
            .toFail()
            .withMessage('Expected promise to have been rejected');
        });

        it('should assert resolving promises as not rejected', () => {
          const def = $q.defer();
          def.resolve();

          this.test
            .withActual($q.defer().promise)
            .toFail()
            .withMessage('Expected promise to have been rejected');
        });
      });

      describe('toRejectWith', () => {
        useMatcher('toRejectWith', version);

        it('should assert promises that are rejected with some message as rejected with that message', () => {
          const def = $q.defer();
          def.reject('message');

          this.test
            .withActual(def.promise)
            .andExpected('message')
            .toPass()
            .withMessage('Expected promise not to have been rejected with \'message\' but was rejected with ' +
              '\'message\'');
        });

        it('should fail when the promise does not resolve', () => {
          this.test
            .withActual($q.defer().promise)
            .andExpected('message')
            .toFail()
            .withMessage('Expected promise to have been rejected with \'message\' but it was not rejected at all');
        });

        it('should pass when the expected value is a callback function and the promise rejects', () => {
          const def = $q.defer();
          def.reject('value');

          this.test
            .withActual(def.promise)
            .andExpected((res) => {
              expect(res).toEqual('value');
            })
            .toPass()
            .withMessage('Expected promise not to have been rejected with Function but was rejected with \'value\'');
        });

        it('should fail when the promise rejects to another value than the expected value', () => {
          const def = $q.defer();
          def.reject('message');

          this.test
            .withActual(def.promise)
            .andExpected('another message')
            .toFail()
            .withMessage('Expected promise to have been rejected with \'another message\' but was rejected with ' +
              '\'message\'');
        });
      });

      describe('toHaveQueryParams', () => {
        useMatcher('toHaveQueryParams', version);

        it('should pass when the actual string has the expected query params', () => {
          this.test
            .withActual('path?param1=param1')
            .andExpected({ param1: 'param1' })
            .toPass()
            .withMessage('Expected URI not to have params Object({ param1: \'param1\' }), actual params were Object({' +
              ' param1: \'param1\' }) in \'path?param1=param1\'');
        });

        it('should fail when the actual string does not have the expected query params', () => {
          this.test
            .withActual('path?param1=param1')
            .andExpected({ param2: 'param2' })
            .toFail()
            .withMessage('Expected URI to have params Object({ param2: \'param2\' }), actual params were Object({ ' +
              'param1: \'param1\' }) in \'path?param1=param1\'');
        });

        it('should pass when the actual string does strictly have the expected query params', () => {
          this.test
            .withActual('path?param1=param1&param2=param2')
            .andExpected({ param1: 'param1', param2: 'param2' }, true)
            .toPass()
            .withMessage('Expected URI not to have params Object({ param1: \'param1\', param2: \'param2\' }), actual ' +
              'params were Object({ param1: \'param1\', param2: \'param2\' }) in \'path?param1=param1&param2=param2\'');
        });

        it('should fail when the actual string does strictly not have the expected query params', () => {
          this.test
            .withActual('path?param1=param1&param2=param2')
            .andExpected({ param1: 'param1' }, true)
            .toFail()
            .withMessage('Expected URI to have params Object({ param1: \'param1\' }), actual params were Object({ ' +
              'param1: \'param1\', param2: \'param2\' }) in \'path?param1=param1&param2=param2\'');
        });
      });

      describe('toContainIsolateScope', () => {
        useMatcher('toContainIsolateScope', version);

        beforeEach(() => {
          this.element = jasmine.createSpyObj('element', ['isolateScope']);
          this.element.isolateScope.and.returnValue({
            key1: 'value1',
            key2: 'value2'
          });
        });

        it('should pass when actual element has the expected values on the isolate scope', () => {
          this.test
            .withActual(this.element)
            .andExpected({ key1: 'value1' })
            .toPass()
            .withMessage('Expected element isolate scope not to contain Object({ key1: \'value1\' }) but got Object({' +
              ' key1: \'value1\', key2: \'value2\' })');
        });

        it('should fail when actual element has the expected values not on the isolate scope', () => {
          this.test
            .withActual(this.element)
            .andExpected({ key3: 'value3' })
            .toFail()
            .withMessage('Expected element isolate scope to contain Object({ key3: \'value3\' }) but got Object({ ' +
              'key1: \'value1\', key2: \'value2\' })');
        });

        it('should fail when actual element has no isolate scope', () => {
          this.element.isolateScope.and.returnValue(undefined);
          this.test
            .withActual(this.element)
            .andExpected({ key1: 'value1' })
            .toFail()
            .withMessage('Expected element isolate scope to contain Object({ key1: \'value1\' }) but the expected ' +
              'element has no isolate scope');
        });

        it('should not test for private angular properties and "this"', () => {
          this.element.isolateScope.and.returnValue({
            $key1: 'value1',
            this: 'value2'
          });

          this.test
            .withActual(this.element)
            .andExpected({ $key1: 'value1' })
            .toFail()
            .withMessage('Expected element isolate scope to contain Object({ $key1: \'value1\' }) but got ' +
              'Object({  })');
        });
      });

      afterAll(() => {
        expectMatcher.jasmineVersion = version === 1 ? 2 : 1;
      });
    });
  });

  describe('toHaveBeenResolved', () => {
    it('is the same matcher as toResolve', () => {
      expect(JasmineMoxMatchers.v2.toHaveBeenResolved).toEqual(JasmineMoxMatchers.v2.toResolve);
    });
  });

  describe('toHaveBeenResolvedWith', () => {
    it('is the same matcher as toResolveWith', () => {
      expect(JasmineMoxMatchers.v2.toHaveBeenResolvedWith).toBe(JasmineMoxMatchers.v2.toResolveWith);
    });
  });

  describe('toHaveBeenRejected', () => {
    it('is the same matcher as toReject', () => {
      expect(JasmineMoxMatchers.v2.toHaveBeenRejected).toBe(JasmineMoxMatchers.v2.toReject);
    });
  });

  describe('toHaveBeenRejectedWith', () => {
    it('is the same matcher as toRejectWith', () => {
      expect(JasmineMoxMatchers.v2.toHaveBeenRejectedWith).toBe(JasmineMoxMatchers.v2.toRejectWith);
    });
  });
});
