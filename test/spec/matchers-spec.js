describe('the promise matchers v2', function () {

  function useMatcher(matcherName) {
    beforeEach(function () {
      // TODO: do not depend on matchers global: http://stackoverflow.com/q/30057827/1187737
      this.test = expectMatcher(jasmineMoxMatchers[matcherName]);
    });
  }

  var $q;

  beforeEach(function () {
    inject(function (_$q_) {
      $q = _$q_;
    });
  });

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
        .withMessage('Expected promise not to have been resolved');
    });

    it('should assert non-resolving promises as not resolved', function () {
      this.test
        .withActual($q.defer().promise)
        .toFail()
        .withMessage('Expected promise to have been resolved');
    });

    it('should assert rejecting promises as not resolved', function () {
      this.test
          .withActual($q.reject())
          .toFail()
          .withMessage('Expected promise to have been resolved');
    });

  });

  describe('toHaveBeenResolved', function () {
    it('is the same matcher as toResolve', function () {
      expect(jasmineMoxMatchers.toHaveBeenResolved).toBe(jasmineMoxMatchers.toResolve);
    });
  });

  describe('toResolveWith', function () {
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

    it('should pass when the expected value is a callback function and the promise resolves', function () {

      var def = $q.defer();
      def.resolve('value');

      this.test
        .withActual(def.promise)
        .andExpected(function callback(res) {
          expect(res).toEqual('value');
        })
        .toPass()
        .withMessage('Expected promise not to have been resolved with Function but was resolved with \'value\'');
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

  describe('toHaveBeenResolvedWith', function () {
    it('is the same matcher as toResolveWith', function () {
      expect(jasmineMoxMatchers.toHaveBeenResolvedWith).toBe(jasmineMoxMatchers.toResolveWith);
    });
  });

  describe('toReject', function () {

    useMatcher('toReject');

    it('should assert promises that are rejected as rejected', function () {
      var def = $q.defer();
      def.reject();

      this.test
          .withActual(def.promise)
          .andExpected(undefined)
          .toPass()
          .withMessage('Expected promise not to have been rejected');
    });

    it('should assert non-resolving promises as not rejected', function () {
      this.test
          .withActual($q.defer().promise)
          .toFail()
          .withMessage('Expected promise to have been rejected');
    });

    it('should assert resolving promises as not rejected', function () {
      var def = $q.defer();
      def.resolve();

      this.test
          .withActual($q.defer().promise)
          .toFail()
          .withMessage('Expected promise to have been rejected');
    });

  });

  describe('toHaveBeenRejected', function () {
    it('is the same matcher as toReject', function () {
      expect(jasmineMoxMatchers.toHaveBeenRejected).toBe(jasmineMoxMatchers.toReject);
    });
  });

  describe('toRejectWith', function () {
    useMatcher('toRejectWith');

    it('should assert promises that are rejected with some message as rejected with that message', function () {
      var def = $q.defer();
      def.reject('message');

      this.test
          .withActual(def.promise)
          .andExpected('message')
          .toPass()
          .withMessage('Expected promise not to have been rejected with \'message\' but was rejected with \'message\'');
    });

    it('should fail when the promise does not resolve', function () {
      this.test
          .withActual($q.defer().promise)
          .andExpected('message')
          .toFail()
          .withMessage('Expected promise to have been rejected with \'message\' but it was not rejected at all');
    });

    it('should pass when the expected value is a callback function and the promise rejects', function () {

      var def = $q.defer();
      def.reject('value');

      this.test
        .withActual(def.promise)
        .andExpected(function callback(res) {
          expect(res).toEqual('value');
        })
        .toPass()
        .withMessage('Expected promise not to have been rejected with Function but was rejected with \'value\'');
    });

    it('should fail when the promise rejects to another value than the expected value', function () {
      var def = $q.defer();
      def.reject('message');

      this.test
          .withActual(def.promise)
          .andExpected('another message')
          .toFail()
          .withMessage('Expected promise to have been rejected with \'another message\' but was rejected with \'message\'');
    });

  });

  describe('toHaveBeenRejectedWith', function () {
    it('is the same matcher as toRejectWith', function () {
      expect(jasmineMoxMatchers.toHaveBeenRejectedWith).toBe(jasmineMoxMatchers.toRejectWith);
    });
  });

  describe('toContainIsolateScope', function () {
    useMatcher('toContainIsolateScope');

    beforeEach(function () {
      this.element = jasmine.createSpyObj('element', ['isolateScope']);
      this.element.isolateScope.and.returnValue({
        key1: 'value1',
        key2: 'value2'
      });
    });

    it('should pass when actual element has the expected values on the isolate scope', function () {
      this.test
        .withActual(this.element)
        .andExpected({ key1: 'value1' })
        .toPass()
        .withMessage('Expected element isolate scope not to contain Object({ key1: \'value1\' }) but got Object({ key1: \'value1\', key2: \'value2\' })');
    });

    it('should fail when actual element has the expected values not on the isolate scope', function () {
      this.test
        .withActual(this.element)
        .andExpected({ key3: 'value3' })
        .toFail()
        .withMessage('Expected element isolate scope to contain Object({ key3: \'value3\' }) but got Object({ key1: \'value1\', key2: \'value2\' })');
    });

    it('should fail when actual element has no isolate scope', function () {
      this.element.isolateScope.and.returnValue(undefined);
      this.test
        .withActual(this.element)
        .andExpected({ key1: 'value1' })
        .toFail()
        .withMessage('Expected element isolate scope to contain Object({ key1: \'value1\' }) but the expected element has no isolate scope');
    });

    it('should not test for private angular properties and "this"', function () {
      this.element.isolateScope.and.returnValue({
        $key1: 'value1',
        this: 'value2'
      });

      this.test
        .withActual(this.element)
        .andExpected({ $key1: 'value1' })
        .toFail()
        .withMessage('Expected element isolate scope to contain Object({ $key1: \'value1\' }) but got Object({  })');
    });

  });
});
