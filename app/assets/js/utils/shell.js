/**
 * Shell utils
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
     * Executes the given command
     * Logs the given message if needed
     * Calls the given function when the process is done if needed
     * @param command
     * @param callback
     */
    module.exec = function(command, callback)
    {
        app.node.exec(command, function(error, stdout, stderr)
        {
            if (typeof callback !== 'undefined')
            {
                callback(stdout, stderr);
            }
        });
    };

    /**
     * Tells if the given process is running
     * @param process
     * @param callback
     */
    module.isProcessRunning = function(process, callback)
    {
        app.node.exec('ps aux', function(error, stdout, stderr)
        {
            callback(stdout.search(process) !== -1, stdout, stderr);
        });
    };

    app.utils.shell = module;

})(window.App);