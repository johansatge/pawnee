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
        app.node.exec('ps aux', function(error, stdout, stderr)
        {
            app.logActivity(stderr);
            var is_running = stdout.search('/usr/sbin/httpd') !== -1;
            app.logActivity(app.locale.apache[is_running ? 'running' : 'stopped']);
            callback({is_running: is_running});
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

    app.utils.apache.server = module;

})(window.App);