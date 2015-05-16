Jasmine Mox Matchers
================

[![Build Status](https://travis-ci.org/fvanwijk/jasmine-mox-matchers.svg?branch=master)](https://travis-ci.org/fvanwijk/jasmine-mox-matchers)
[![Test Coverage](https://codeclimate.com/github/fvanwijk/jasmine-mox-matchers/badges/coverage.svg)](https://codeclimate.com/github/fvanwijk/jasmine-mox-matchers)
[![Code Climate](https://codeclimate.com/github/fvanwijk/jasmine-mox-matchers/badges/gpa.svg)](https://codeclimate.com/github/fvanwijk/jasmine-mox-matchers)

This package include some matchers for testing Angular promises without having to `$digest` manually.
They were made for the Resource testing DSL in [Mox](http://www.github.com/fvanwijk/mox), but also very useful when included separately.

* Promise matchers
* Matcher for directive isolate scope testing

# Installing

`bower install jasmine-mox-matchers --save-dev`

Include dist/jasmine-mox-matchers.min.js file in the files list of karma.conf, depending on the version of Jasmine you are using.

# Documentation

## Promise matchers

[Promises](https://docs.angularjs.org/api/ng/service/$q) are a powerful concept in Javascript but somewhat hard to test. Your test case usually may look like this:

```javascript
SomeService.getData() // Returns a promise that resolves to 'data'
  .then(function success(result) {
    expect(result).toEqual('data');
  });
```

With the promise matchers, this test will do everything.

```javascript
  var promise = SomeService.getData();
  $scope.$digest();
  expect(promise).toResolveWith('data');
```

Apart from the 3 lines of boilerplate code, this way of testing does not guarantee that your promise will resolve! If the promise does not resolve, the `expect` will not be called and the test passes.

*Note that a lot of promise matchers on Github still work this way!*

## Directive matcher

When you mock a directive away, you still want to test of scope vars are passed to the directive correctly. This can be tested by testing the directive attribute.
These attributes usually are models or expressions, so you will be testing the literal value of the attribute.
It is better to test the evaluated value, which can be done by testing the isolate scope of the directive.

```javascript
$scope.list = ['first', 'second'];
$scope.title = 'The title';
var element = $compile('<div directive-name="list" title="title"></div>')($scope);
$scope.$digest();
expect(element).toContainIsolateScope({
  directiveName: $scope.list,
  title: $scope.title
});
```

# API

## toBePromise()
Tests if a given object is a promise object.
The Promises/A spec (http://wiki.commonjs.org/wiki/Promises/A) only says it must have a function 'then', so, I guess we'll go with that for now.

```javascript
expect(promise).toBePromise();
```

## toResolve() / toHaveBeenResolved()
Asserts that a Promise is resolved.

```javascript
expect(promise).toBeResolved();
```

## toResolveWith() / toHaveBeenResolved()
Verifies that a Promise is resolved with the specified argument.

```javascript
expect(promise).toBeResolvedWith('something');
```

## toReject() / toHaveBeenRejected()
Asserts that a Promise is rejected before the end of the test.

```javascript
expect(promise).toBeRejected();
```

## toRejectWith() / toHaveBeenRejectedWith()

Asserts that a Promise is rejected with the specified argument.

```javascript
expect(promise).toBeRejectedWith('something');
```
  
## toContainIsolateScope()

Asserts that the passed key/value pairs are on the isolate scope of the element.

```javascript
expect(element).toContainIsolateScope({ bindingKey: 'value' });
```

# Development

* `npm install`
* `bower install`

Run `grunt -h` to see available tasks.