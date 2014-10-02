define(['services/app-router/hash-matcher'], function(HashMatcher) {
	'use strict';

	describe('Testing AppRouter/HashMatcher', function () {
		
		it('Should match single pattern "foo"', function () {
			var route = new HashMatcher([{controller: 'ok', pattern: 'foo'}]).match('foo');
			assert.isObject(route);
			assert.equal(route.controller, 'ok');
		});
		
		it('Should match one of many patterns', function () {
			var route = new HashMatcher([{controller: 'ok', pattern: 'foo/:id'}, {controller: 'foo', pattern: 'foo'}]).match('foo');
			assert.isObject(route);
			assert.equal(route.controller, 'foo');
		});
		
		it('Should not care whenever there is a leading # or not', function () {
			var route = new HashMatcher([{controller: 'foo', pattern: '#foo/:id'}]).match('#foo/11');
			assert.isObject(route);
			assert.equal(route.params [0], 11);
			assert.equal(route.controller, 'foo');
		});
		
	});
});