/**
 * Panel controller
 */
(function(app, $)
{

    'use strict';

    var module = function()
    {

        var view = new app.views.panel();
        var events = new app.node.events.EventEmitter();

        /**
         * Attaches an event
         * @param event
         * @param callback
         */
        this.on = function(event, callback)
        {
            events.on(event, callback);
        };

        /**
         * Inits the controller
         */
        this.init = function()
        {
            view.init();
            view.on('loaded', $.proxy(_onViewLoaded, this));
        };

        /**
         * Fired when the view is loaded
         */
        var _onViewLoaded = function()
        {
            events.emit('loaded');
        };

        /**
         * Toggles the view
         * @param x
         * @param y
         */
        this.toggle = function(x, y)
        {
            view.toggle(x, y);
        };

    };

    app.controllers.panel = module;

})(window.App, jQuery);