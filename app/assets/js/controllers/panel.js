/**
 * Panel controller
 */
(function(app, $)
{

    'use strict';

    var module = function()
    {

        var view = new app.views.panel();

        /**
         * Inits the controller
         */
        this.init = function()
        {
            view.show();
        };

    };

    app.controllers.panel = module;

})(window.App, jQuery);