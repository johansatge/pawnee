/**
 * Panel controller
 */
(function(app, $)
{

    'use strict';

    var module = function()
    {

        var events = new app.node.events.EventEmitter();
        var view;

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
        this.load = function()
        {
            view = new app.views.panel();
            view.init();
            view.on('loaded', $.proxy(_onViewLoaded, this));
            view.on('action', $.proxy(_onViewAction, this));
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
         * Sets working status
         */
        this.setWorking = function()
        {
            view.togglePendingState(true);
            view.disableSwitcher();
        };

        /**
         * Stops doing Apache CLI stuff
         * @param is_running
         * @param modules
         */
        this.setIdle = function(is_running, modules)
        {
            // @todo update vhost list
            view.setModules(modules);
            view.togglePendingState(false);
            view.enableSwitcher(is_running);
        };

        /**
         * Starts watching Apache files when the view is ready
         */
        var _onViewLoaded = function()
        {
            events.emit('loaded');
        };

        /**
         * Fired when an action is called from the view
         * @param action
         * @param data
         */
        var _onViewAction = function(action, data)
        {
            events.emit('action', action, data);
        };

    };

    app.controllers.panel = module;

})(window.App, jQuery);