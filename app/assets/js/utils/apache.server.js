/**
 * Apache server
 * @todo handle errors and output when doing shell scripts
 */
(function(app)
{

    'use strict';

    var module = {};

    /**
     * Toggles the server status (start, stop, restart)
     * @param state
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
        app.utils.shell.isProcessRunning('/usr/sbin/httpd', function(is_running)
        {
            callback(is_running);
        });
    };

    /**
     * Checks Apache configuration
     * @param callback
     */
    module.checkConfiguration = function(callback)
    {
        app.node.exec('apachectl -t', function(error, stdout, stderr)
        {
            callback();
        });
    };

    app.utils.apache.server = module;

})(window.App);