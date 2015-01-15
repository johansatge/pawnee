/**
 * Panel controller
 */
(function(app, $)
{

    'use strict';

    var module = {};

    var events = new app.node.events.EventEmitter();

    /**
     * Attaches an event
     * @param event
     * @param callback
     */
    module.on = function(event, callback)
    {
        events.on(event, callback);
    };

    /**
     * Inits the controller
     */
    module.load = function()
    {
        app.views.panel.init();
        app.views.panel.on('loaded', $.proxy(_onViewLoaded, this));
        app.views.panel.on('action', $.proxy(_onViewAction, this));
    };

    /**
     * Toggles the view
     * @param x
     * @param y
     */
    module.toggle = function(x, y)
    {
        app.views.panel.toggle(x, y);
    };

    /**
     * Fired when the view is loaded
     */
    var _onViewLoaded = function()
    {
        app.utils.apache.on('load_config', $.proxy(_onApacheLoadConfiguration, this));
        app.utils.apache.on('loaded_config', $.proxy(_onApacheLoadedConfiguration, this));
        app.utils.apache.watch();
        events.emit('loaded');
    };

    /**
     * Starts loading the Apache configuration
     */
    var _onApacheLoadConfiguration = function()
    {
        // @todo add "pending" state to the view
    };

    /**
     * Updates the UI when the Apache configuration has been loaded
     */
    var _onApacheLoadedConfiguration = function(modules)
    {
        // @todo update modues & vhost list
        app.views.panel.setModules(modules);
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
            // @todo
            app.log(data.module);
            app.log(data.enable);
        }
    };

    app.controllers.panel = module;

})(window.App, jQuery);