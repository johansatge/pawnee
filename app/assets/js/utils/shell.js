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
     * @param message
     */
    module.exec = function(command, callback, message)
    {
        if (typeof message !== 'undefined')
        {
            app.logActivity(message);
        }
        app.node.exec(command, function(error, stdout, stderr)
        {
            // @todo log activity
            if (typeof callback !== 'undefined')
            {
                callback();
            }
        });
    };

    /**
     * Checks if the given process is running and triggers the callback accordingly
     * @param process
     * @param running_callback
     * @param idle_callback
     */
    module.execIfProcessRunning = function(process, running_callback, idle_callback, message)
    {
        if (typeof message !== 'undefined')
        {
            app.logActivity(message);
        }
        app.node.exec('ps aux', function(error, stdout, stderr)
        {
            var std = stdout + stderr;
            std.search(process) !== -1 ? running_callback(true) : idle_callback(false);
        });
    };

    app.utils.shell = module;

})(window.App);