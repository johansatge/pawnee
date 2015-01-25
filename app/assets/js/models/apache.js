/**
 * Apache model
 */
(function(app, $)
{

    'use strict';

    var module = {};
    var events = new app.node.events.EventEmitter();
    module.confPath = '/etc/apache2/httpd.conf';
    module.modulesPath = '/usr/libexec/apache2/';
    module.relativeModulesPath = 'libexec/apache2/';

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
     * Starts watching files
     */
    module.watchFiles = function()
    {
        var watcher = new app.utils.apache.watcher();
        watcher.on('change', _onWatcherUpdate);
        watcher.watch();
    };

    /**
     * Toggles the server state (start, stop, restart)
     * @param state
     */
    module.toggleServerState = function(state)
    {
        events.emit('working');
        app.utils.apache.server.toggleState(state, function()
        {
            _refreshConfiguration();
        });
    };

    /**
     * Toggles the state of a module
     * @param module
     * @param enable
     */
    module.toggleModuleState = function(module, enable)
    {
        events.emit('working');
        app.utils.apache.module.toggleState(module, enable);
    };

    /**
     * Restarts the server when a config file changes (if already running)
     */
    var _onWatcherUpdate = function()
    {
        events.emit('working');
        app.utils.apache.server.isRunning(function(is_running)
        {
            if (is_running)
            {
                app.utils.apache.server.toggleState('restart', _refreshConfiguration);
            }
            else
            {
                _refreshConfiguration();
            }
        });
    };

    /**
     * Asynchronously refreshes the configuration and sends an event when it's done
     */
    var _refreshConfiguration = function()
    {
        app.logActivity(app.locale.apache.check);
        app.utils.apache.server.checkConfiguration(function()
        {
            app.utils.apache.module.get(_emitConfiguration);
        });
    };

    /**
     * Checks the status and emits the server configuration to the app
     * @param modules
     */
    var _emitConfiguration = function(modules)
    {
        app.utils.apache.server.isRunning(function(is_running)
        {
            app.logActivity(app.locale.apache[is_running ? 'running' : 'stopped']);
            events.emit('idle', is_running, modules);
        });
    };

    app.models.apache = module;

})(window.App, jQuery);