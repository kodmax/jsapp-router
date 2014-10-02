jsapp-router (aka webapp-router)
==============
Smart web application router. Full integration with browser history.
Router controller is called for each hash match, later it gets events whenever there is a navin, navout or dispose of the router (synchronized with browser history api).
Route preloading is possible for quick and fancy navigation like swipe gestures.

example "match all" route
```js
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
```  