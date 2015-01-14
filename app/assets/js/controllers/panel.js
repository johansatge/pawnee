/**
 * Panel controller
 */
(function(app, $)
{

    'use strict';

    var module = function()
    {

        var view = new app.views.panel();
        var model = new app.models.panel();
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
            view.on('action', $.proxy(_onViewAction, this));
        };

        /**
         * Updates the configuration
         * Triggered when the Apache configuration has been updated
         */
        this.updateConfiguration = function()
        {
            console.log('@todo parse httpd.conf and update view');
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

        /**
         * Fired when the view is loaded
         */
        var _onViewLoaded = function()
        {
            events.emit('loaded');
        };

        /**
         * Fired when an action is called from the view
         * @param action
         */
        var _onViewAction = function(action)
        {
            console.log(action);
        };

    };

    app.controllers.panel = module;

})(window.App, jQuery);