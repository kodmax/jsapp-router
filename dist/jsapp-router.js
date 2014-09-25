(function (__this) {
var appRouter = (function () {
var __stone_modules = {};
__stone_modules ['./pattern-regexp'] = (function () {
	'use strict';

	var patternRegexp = function (pattern) {
		return new RegExp('^' + pattern.replace(/^#/, '').replace(/:[\w-]+/g, '([\\w-]+)') + '$');
	};

	return patternRegexp;
})();
__stone_modules ['./hash-matcher'] = (function (patternRegexp) {
	'use strict';

	/**
	 * @class app-router.HashMatcher
	 * @param {Array} collections of patterns {pattern, controller}. Pattern may be a string (Backbone style) or a regex.
	 */
	var HashMatcher = function (routes) {
		
		
		/**
		 * Matches hash agains the patterns. Returns the matched route's controller.
		 * @method app-router.HashMatcher#match
		 * @returns controller
		 */
		this.match = function (hash) {
			hash = (hash + '').replace(/^#/, '');
			
			for (var i = 0; i < routes.length; i++) {
				var route = routes [i];
				
				if (!(route.pattern instanceof RegExp)) {
					route.pattern = patternRegexp(route.pattern);
				}
				
				var match = route.pattern.exec(hash);
				if (match) {
					match.shift();
					return { params: match, controller: route.controller, options: route.options };
				}
			}
		};
	};
	
	return HashMatcher;
})(__stone_modules ['./pattern-regexp']);
__stone_modules ['./navigator'] = (function () {
	'use strict';

	/**
	 * Reacts on hash changes. Calls create, navin, navout, dispose on the promise
	 * @class app-router.Navigator
	 * @param {app-router.NavigatorPromise} promise
	 */
	var Navigator = function (promise) {
		var contexts = {};
		
		var currentStateTs;
		var previousStateTs;
		var previousContext;
		var context;
		addEventListener('popstate', function (event) {
			var state = event.state;
			
			if (state && state ['state-id'] && contexts [state ['state-id']]) {
				context = contexts [state ['state-id']];
				currentStateTs = state ['state-id'];
			}
		});
		
		var hashchange = function (hash) {
			if (!context) {
				var stateId = new Date().getTime();
				currentStateTs = stateId;
				
				if (previousStateTs) {
					// there is a known issue that some backward history entries will get disposed if users starts app and navigate backward to old instances urls.
					Object.keys(contexts).forEach(function (ts) {
						if (ts > previousStateTs) {
							promise.dispose(contexts [ts]);
							delete contexts [ts];
						}
					});
				}
				
				context = contexts [stateId] = promise.create(hash);
				history.replaceState({ 'state-id': stateId });
			}
			
			if (previousContext) {
				promise.navout(previousContext);
			}
			promise.navin(context);
			
			previousStateTs = currentStateTs;
			previousContext = context;
			currentStateTs = null;
			context = null;
		};
		
		addEventListener('hashchange', function (event) {
			hashchange(location.hash); 
		});
		
		hashchange(location.hash);
	};
	
	return Navigator;
})();
__stone_modules ['./event-bus'] = (function () {
	'use strict';

	var EventBus = function () {
		var events = {};
		
		this.on = function (eventName, callback) {
			events [eventName] = callback;
		};
		
		this.trigger = function (eventName, event, context) {
			if (events [eventName]) {
				events [eventName].call(context, event);
			}
		};
	};
	
	return EventBus;
})();
__stone_modules ['./controller-context'] = (function () {
	'use strict';

	var ControllerContext = function (hash, params, eventBus) {
		
		this.getHash = function () {
			return hash;
		};
		
		this.on = eventBus.on;
	};
	
	return ControllerContext;
})();
__stone_modules ['./controller-driver'] = (function (EventBus, ControllerContext) {
	'use strict';

	/**
	 * @class app-router.ControllerDriver
	 */
	var ControllerDriver = function (hash, controller, params, options) {
		options = options || {};
		
		var eventBus = new EventBus();
		var controllerContext = new ControllerContext(hash, params, eventBus);
		
		this.navin = function () {
			eventBus.trigger('navin', {}, controllerContext);
			if (options.trivialController) {
				controller.apply(controllerContext, params || []);
			}
		};
		
		this.navout = function () {
			eventBus.trigger('navout', {}, controllerContext);
		};
		
		this.dispose = function () {
			eventBus.trigger('dispose', {}, controllerContext);
		};
		
		if (!options.trivialController) {
			var events = controller.apply(controllerContext, params || []);
			if (typeof events === 'object') {
				Object.keys(events).forEach(function (eventName) {
					eventBus.on(eventName, events [eventName]);
				});
			}
		}
	};
	
	return ControllerDriver;
})(__stone_modules ['./event-bus'], __stone_modules ['./controller-context']);
__stone_modules ['./standard-not-found-controller'] = (function () {
	'use strict';

	var standardNotFoundController = function () {
		var msg = 'AppRouter: route ' + this.getHash() + ' not found';
		
		this.on('navin', function () {
			if (console.warn) {
				console.warn(msg);
				
			} else {
				console.log (msg);
			}			
		});
	};
	
	return standardNotFoundController;
})();
__stone_modules ['services/app-router/app-router'] = (function (HashMatcher, Navigator, ControllerDriver, standardNotFoundController) {
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
	
		
		var navigator;
		/**
		 * @method app-router.AppRouter#start
		 * @returns app-router.AppRouter
		 */
		this.start = function () {
			if (!navigator) {
				navigator = new Navigator({
					
					create: function (hash) {
						var match = hashMatcher.match(hash);
						if (match) {
							return new ControllerDriver(hash, match.controller, match.params, match.options);
							
						} else {
							return new ControllerDriver(hash, standardNotFoundController);
						}
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
})(__stone_modules ['./hash-matcher'], __stone_modules ['./navigator'], __stone_modules ['./controller-driver'], __stone_modules ['./standard-not-found-controller']);
__stone_modules ['appRouter'] = (function (AppRouter, module) {
	'use strict';

	return new AppRouter(module.config());
})(__stone_modules ['services/app-router/app-router'], {config: function () { return {}; }});
return __stone_modules ['appRouter'];
})();

if (typeof define === 'function' && define['amd']) {   
    define([], function () {
    	return appRouter;
    });
    
} else {
	__this.appRouter = appRouter;
}
})(this);