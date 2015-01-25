/**
 * Apache server
 */
(function(app)
{

    'use strict';

    var module = {};

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
     * @param callback
     */
    module.isRunning = function(callback)
    {
        _isProcessRunning('/usr/sbin/httpd', function(is_running)
        {
            app.logActivity(app.locale.apache[is_running ? 'running' : 'stopped']);
            callback(is_running);
        });
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
     * Tells if the given process is running
     * @param process
     * @param callback
     */
    var _isProcessRunning = function(process, callback)
    {
        app.node.exec('ps aux', function(error, stdout, stderr)
        {
            app.logActivity(stderr);
            callback(stdout.search(process) !== -1, stdout, stderr);
        });
    };

    app.utils.apache.server = module;

})(window.App);