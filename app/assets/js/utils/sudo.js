/**
 * Sudo utils
 */
(function(app, $)
{

    'use strict';

    var module = {};
    var events = new app.node.events.EventEmitter();
    var keepAliveDelay = 60000;

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
     * Asks for the sudo password and waits for the answer
     */
    module.ask = function()
    {
        var prompt_script = 'tell Application \\"System Events\\" to display dialog \\"%s\\" with icon caution with hidden answer default answer \\"\\"';
        var return_script = 'text returned of result';
        var command = 'sudo -K && osascript -e "' + prompt_script.replace('%s', app.locale.sudo) + '" -e "' + return_script + '" | sudo -S echo "is_sudo"';
        app.node.exec(command, $.proxy(_onAsked, this));
    };

    /**
     * Received answer from the CL when a password has been filled
     * @param error
     * @param stdout
     * @param stderr
     */
    var _onAsked = function(error, stdout, stderr)
    {
        var std = stdout + stderr;
        var answer = std.search(/is_sudo/gi) !== -1 ? 'success' : ((std.search(/-128/g) !== -1 ? 'cancel' : 'fail'));
        events.emit('answer', answer);
        if (answer === 'success')
        {
            _keepAlive();
        }
    };

    /**
     * Keeps sudo alive
     */
    var _keepAlive = function()
    {
        app.node.exec('sudo -v', function(error, stdout, stderr)
        {
            setTimeout(_keepAlive, keepAliveDelay);
        });
    };

    app.utils.sudo = module;

})(window.App, jQuery);