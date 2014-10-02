jsapp-router (aka webapp-router)
==============
Smart web application router. Full integration with browser history.
Router controller is called for each hash match, later it gets events whenever there is a navin, navout or dispose of the router (synchronized with browser history api).
Route preloading is possible for quick and fancy navigation like swipe gestures.

example "match all" route
```js
    appRouter.addController(':hash', function (hash) {
        var homeCard = tpl('app-card', { parent: box });
        
        var log = function (msg) {
            homeCard.getNodeByName('log').innerHTML += msg + '<br />';
        };
        
        log('created #' + hash);
        
        return {
            navin: function () {
                $(homeCard.getRootNode()).addClass('app-card--active');
                log('navin');
            },
            
            navout: function () {
                $(homeCard.getRootNode()).removeClass('app-card--active');
                log('navout');
            },
            
            dispose: function () {
                box.removeChild(homeCard.getRootNode());
                log('dispose');
            }
        };
    });
```  