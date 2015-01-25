/**
 * Apache model
 */
(function(app, $)
{

    'use strict';

    var events = new app.node.events.EventEmitter();
    var confPath = '/etc/apache2/httpd.conf';
    var modulesPath = '/usr/libexec/apache2/';
    var relativeModulesPath = 'libexec/apache2/';

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
    module.init = function()
    {
        var watcher = new app.utils.apache.watcher();
        watcher.on('update', apache.utils.server.restartServerIfRunning);
    };

    module.restart

    /**
     * Toggles the server state (start, stop, restart)
     * @param state
     */
    module.toggleServerState = function(state)
    {
        events.emit('working');
        app.utils.apache.server.toggleState(state);
    };

    /**
     * Toggles the state of a module
     * @param module
     * @param enable
     */
    module.toggleModuleState = function(module, enable)
    {
        events.emit('working');
        app.utils.apache.module.toggleModule(module, enable);
    };

    /**
     * Asynchronously refreshes the configuration when a request has bee done (filechange, restart, etc)
     * This will check if Apache is running, get the config files, and send an event when everything is done
     */
    var _requestConfigurationRefresh = function()
    {
        app.logActivity(app.locale.apache.check);
        app.node.exec('apachectl -t', function(error, stdout, stderr)
        {
            app.utils.apache.module.getModules(_emitConfiguration);
        });
    };

    /**
     * Checks the status and emits the server configuration to the app
     * @param modules
     */
    var _emitConfiguration = function(modules)
    {
        app.utils.shell.isProcessRunning('/usr/sbin/httpd', function(is_running)
        {
            app.logActivity(app.locale.apache[is_running ? 'running' : 'stopped']);
            events.emit('idle', is_running, modules);
        });
    };

    app.models.apache = module;

})(window.App, jQuery);