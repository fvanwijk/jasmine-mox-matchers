/**
 * The matchers can be tested by just using them. This will only test positive cases, but we also want to test the cases where the matcher is failing.
 * Beside that, we also want to test the matchers that are made for another Jasmine version than the Jasmine version used in this project.
 * Therefore we need to test all matchers in a more technical way, eg. just how Jasmine tests its own matchers:
 * https://github.com/jasmine/jasmine/tree/master/spec/core/matchers
 */

describe('the promise matchers', function () {
  var $q, $rootScope;

  beforeEach(inject(function (_$q_) {
    $q = _$q_;
  }));

  describe('toResolve / toHaveBeenResolved', function () {

    it('should assert promises that are resolved as resolved', function () {
      var def = $q.defer();
      def.resolve();
      expect(def.promise).toResolve();
    });

  });

  describe('toResolveWith / toHaveBeenResolvedWith', function () {

    it('should assert promises that are resolved with some value as resolved with that value', function () {
      var def = $q.defer();
      def.resolve('value');
      expect(def.promise).toResolveWith('value');
    });

  });
});