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
         * Starts doing Apache CLI stuff (when a file changes, or if the user asked to do something)
         */
        var _onApacheWorking = function()
        {
            view.togglePendingState(true);
            view.disableSwitcher();
        };

        /**
         * Stops doing Apache CLI stuff
         * @param config
         */
        var _onApacheIdle = function(config)
        {
            // @todo update vhost list & update switcher
            view.setModules(config.modules);
            view.togglePendingState(false);
            view.enableSwitcher();
        };

        /**
         * Fired when an action is called from the view
         * @param action
         * @param data
         */
        var _onViewAction = function(action, data)
        {
            if (action === 'toggle_server')
            {
                // @todo
            }
            if (action === 'restart_server')
            {
                app.utils.apache.restart();
            }
            if (action === 'toggle_module')
            {
                app.utils.apache.toggleModule(data.module, data.enable);
            }
        };

    };

    app.controllers.panel = module;

})(window.App, jQuery);