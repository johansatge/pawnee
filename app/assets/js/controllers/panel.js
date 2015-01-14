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
            view.on('action', $.proxy(_onViewAction, this));
        };

        /**
         * Updates the configuration of the panel
         */
        this.updateConfiguration = function()
        {
            // @todo update modules and vhosts lists
            var modules = app.utils.apache.getAvailableModules();
            view.setModules(modules);
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
         * @param value
         */
        var _onViewAction = function(action, data)
        {
            console.log(action);
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
                // @todo
                app.log(data.module);
                app.log(data.enable);
            }
        };

    };

    app.controllers.panel = module;

})(window.App, jQuery);