jsapp-router (aka webapp-router)
==============
Smart web application router. Full integration with browser history.

# Getting started
## Installation
Bower can be used to install the compiled router.
```shell
bower install jsapp-router
```
## Setup
At this time only requirejs AMD is supported. You have to configure the path first.

# Example use case
```js
require(['app-router'], function (appRouter) {
    appRouter.addController('foo/:id', function (id) {
        
        // create the view here
        
        return {
            navin: function () {
                // show the view
            },
            
            navout: function () {
                // hide the view
            },
            
            dispose: function () {
                // dispose the view
            }
        };
    });
    
    appRouter.start();
});
```
# Getting full documentation
```shell
grunt jsdoc
```