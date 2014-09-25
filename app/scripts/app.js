require.config({

	baseUrl: 'scripts/',
	
	paths: {
		'modernizr': '.3rd-party/modernizr/modernizr',
		'universal-time': 'services/universal-time/f',
		'jquery': '.3rd-party/jquery/dist/jquery',
		'jquery.no-global': '.no-global/jquery',
		'dom-templates': '.compiled/templates',
		'underscore': '.3rd-party/underscore/underscore',
		'underscore.no-global': '.no-global/underscore',
		'backbone': '.3rd-party/backbone/backbone',
		'backbone.no-global': '.no-global/backbone',
		'dom-node': 'services/dom-node/dom-node',
		'app-router': 'services/app-router/f',
		'translate': 'services/translate/t',
		'exception': 'lib/exception'		
	},
	
	map: {
		'backbone.no-global': { backbone: 'backbone'},
		'underscore.no-global': { underscore: 'underscore'},
		'jquery.no-global': { jquery: 'jquery'},
		'*': {jquery: 'jquery.no-global', underscore: 'underscore.no-global', backbone: 'backbone.no-global'}
	},
	
	shim: {
		'modernizr': { init: function () {
			var modernizr = Modernizr;
			delete window.Modernizr;
			return modernizr;
		}}
	}
});

require(['dom-templates', 'app-router', 'services/app-router/navigator'], function (tpl, appRouter, Navigator) {
	document.body.removeChild(document.getElementsByTagName('app-loader')[0]);
	tpl('app-bar', { parent: document.body });
	
	
	appRouter.addRoute('', function () {
		console.log('creating home card');
	});
	
	appRouter.addRoute('category/:id', function (id) {
		console.log('creating category ' + id + ' card');
	});
	
	appRouter.addRoute('product/:id', function (id) {
		console.log('creating product ' + id + ' card');
	});
	
	appRouter.start();
});
