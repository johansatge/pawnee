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
         * Starts watching Apache files when the view is ready
         */
        var _onViewLoaded = function()
        {
            app.utils.apache.on('working', $.proxy(_onApacheWorking, this));
            app.utils.apache.on('idle', $.proxy(_onApacheIdle, this));
            app.utils.apache.watch();
            events.emit('loaded');
        };

        /**
         * Starts loading the Apache configuration
         */
        var _onApacheWorking = function()
        {
            // @todo add "pending" state to the view
        };

        /**
         * Updates the UI when the Apache configuration has been loaded
         */
        var _onApacheIdle = function(modules)
        {
            // @todo update vhost list
            if (modules !== false)
            {
                view.setModules(modules);
            }
        };

        /**
         * Fired when an action is called from the view
         * @param action
         * @param value
         */
        var _onViewAction = function(action, data)
        {
            if (action === 'toggle_server')
            {
                // @todo
            }
            if (action === 'restart_server')
            {
                // @todo
            }
            if (action === 'toggle_module')
            {
                app.utils.apache.toggleModule(data.module, data.enable);
            }
        };

    };

    app.controllers.panel = module;

})(window.App, jQuery);