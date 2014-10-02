define(['./hash-matcher', './navigator', './controller-driver', './standard-not-found-controller'], function(HashMatcher, Navigator, ControllerDriver, standardNotFoundController) {
	'use strict';

	/**
	 * @namespace app-router
	 */
	
	/**
	 * Application Router.
	 * @class app-router.AppRouter
	 */
	var AppRouter = function (options) {
		var patterns = [];
		var hashMatcher = new HashMatcher(patterns);

		/**
		 * @callback app-router.route-controller
		 * @this app-router.ControllerContext
		 */
		
		/**
		 * @method app-router.AppRouter#addRoute
		 * @param pattern
		 * @param {app-router.route-controller} controller
		 * @returns app-router.AppRouter
		 */
		this.addRoute = function (pattern, controller) {
			patterns.push({pattern: pattern, controller: controller, options: { trivialController: true }});
			return this;
		};
		
		/**
		 * @method app-router.AppRouter#addController
		 * @param pattern
		 * @param {app-router.route-controller} controller
		 * @returns app-router.AppRouter
		 */
		this.addController = function (pattern, controller) {
			patterns.push({pattern: pattern, controller: controller});
			return this;
		};
		
		/**
		 * @method app-router.AppRouter#setNotFoundRoute
		 * @param {app-router.route-controller} controller
		 * @returns app-router.AppRouter
		 */
		this.setNotFoundRoute = function (controller) {
			notFoundController = controller;
			return this;
		};
	
		/**
		 * Simple wrapper for window.location.hash
		 * @method app-router.AppRouter#navigate
		 * @param {String} hash
		 * @returns app-router.AppRouter
		 */
		this.navigate = function (hash) {
			window.location.hash = hash;
			return this;
		};
	
		/**
		 * Change address bar hash without triggering a route
		 * @method app-router.changeHash
		 * @param {String} hash
		 * @returns app-router.AppRouter
		 */
		this.changeHash = function (hash) {
			history.pushState(history.state, document.title, '#' + hash.replace(/^#/, ''));
			return this;
		};
		
		
		var preloaded;
		
		/**
		 * Preloads a route without navigating to it.
		 * Preloaded route will get a 'navin' event if it is navigated to or 'dispose' if the next navigation goes elsewhere.
		 * @method app-router.preload
		 * @param {String} hash
		 * @returns app-router.AppRouter
		 * 
		 */
		this.preload = function (hash) {
			if (preloaded) {
				preloaded.driver.dispose();
			}
			preloaded = { driver: createDriver(hash), hash: hash };
			return this;
		};

		var createDriver = function (hash) {
			var match = hashMatcher.match(hash);
			if (match) {
				return new ControllerDriver(hash, match.controller, match.params, match.options);
				
			} else {
				return new ControllerDriver(hash, standardNotFoundController);
			}			
		};
		
		var navigator;
		/**
		 * @method app-router.AppRouter#start
		 * @returns app-router.AppRouter
		 */
		this.start = function () {
			if (!navigator) {
				navigator = new Navigator({
					
					create: function (hash) {
						if (preloaded) {
							if (preloaded.hash == hash) {
								var driver = preloaded.driver;
								preloaded = undefined;
								return driver;
								
							} else {
								preloaded.driver.dispose();
								preloaded = undefined;
							}
						} 
						
						return createDriver(hash);
					},
					
					navin: function (driver) {
						driver.navin();
					},
					
					navout: function (driver) {
						driver.navout();
					},
					
					dispose: function (driver) {
						driver.dispose();
					}
					
				});
			}
			return this;
		};
	};
	
	return AppRouter;
});