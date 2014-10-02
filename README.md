jsapp-router (aka webapp-router)
==============
Smart web application router. Full integration with browser history.

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