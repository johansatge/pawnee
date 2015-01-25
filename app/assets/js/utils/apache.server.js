/**
 * Apache server
 * @todo handle errors and output when doing shell scripts
 */
(function(app)
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
     * Toggles the server status (start, stop, restart)
     * @param state
     */
    module.toggle = function(state)
    {
        events.emit('working');
        app.logActivity(app.locale.apache[state]);
        app.node.exec('sudo apachectl ' + state, function(error, stdout, stderr)
        {
            _requestConfigurationRefresh();
        });
    };

    /**
     * Toggles the state of a module
     * The watcher will automatically restart the server on file change
     * @param module
     * @param enable
     */
    module.toggleModule = function(module, enable)
    {
        events.emit('working');
        app.utils.apache.module.toggle(module, enable);
    };

    /**
     * Starts watching files
     */
    module.watch = function()
    {
        var watcher = new app.utils.apache.watcher();
        watcher.on('change', _onFileChange);
        watcher.watch();
    };

    /**
     * Restarts the server when a config file changes (if already running)
     */
    var _onFileChange = function()
    {
        events.emit('working');
        app.utils.shell.isProcessRunning('/usr/sbin/httpd', function(is_running)
        {
            (is_running ? module.toggle : _requestConfigurationRefresh)('restart');
        });
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
            app.utils.apache.module.get(_emitConfiguration);
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

    app.utils.apache.server = module;

})(window.App);