define([], function() {
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
				history.replaceState({ 'state-id': stateId }, document.title);
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
});