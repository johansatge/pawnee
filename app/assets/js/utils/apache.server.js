/**
 * Apache server
 */
(function(app)
{

    'use strict';

    var module = {};
    var watcherCallback;
    var isRunning = null;

    /**
     * Toggles the server status (start, stop, restart)
     * @param state
     * @param callback
     */
    module.toggleState = function(state, callback)
    {
        app.logActivity(app.locale.apache[state]);
        app.node.exec('sudo apachectl ' + state, function(error, stdout, stderr)
        {
            callback();
        });
    };

    /**
     * Checks if the server is running
     */
    module.isRunning = function()
    {
        return isRunning;
    };

    /**
     * Starts watching httpd process
     * @param callback
     */
    module.watchProcess = function(callback)
    {
        watcherCallback = callback;
        _recursiveWatchProcess();
    };

    /**
     * Checks Apache configuration
     * @param callback
     */
    module.checkConfiguration = function(callback)
    {
        app.logActivity(app.locale.apache.check);
        app.node.exec('apachectl -t', function(error, stdout, stderr)
        {
            app.logActivity(stderr);
            callback();
        });
    };

    /**
     * Recursively watches Apache process (httpd)
     */
    var _recursiveWatchProcess = function()
    {
        app.node.exec('ps -ax | grep "httpd"', function(error, stdout, stderr)
        {
            var is_running = stdout.search('/usr/sbin/httpd') !== -1;
            if (isRunning !== is_running)
            {
                app.logActivity(app.locale.apache[is_running ? 'running' : 'stopped']);
                watcherCallback(is_running);
                isRunning = is_running;
            }
            setTimeout(_recursiveWatchProcess, 2000);
        });
    };

    app.utils.apache.server = module;

})(window.App);