/**
 * Sudo utils
 * @todo keep alive & make class
 */
(function(app, $)
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
     * Asks for the sudo password and waits for the answer
     */
    module.ask = function()
    {
        // @todo move script here
        var command = 'sudo -K && osascript templates/sudo.scpt | sudo -S echo "is_sudo"';
        app.node.exec(command, $.proxy(_onAsked, this));
    };

    /**
     * Received answer from the CL when a password has been filled
     * @param error
     * @param stdout
     * @param stderr
     * @private
     */
    var _onAsked = function(error, stdout, stderr)
    {
        var std = stdout + stderr;
        var event = std.search(/is_sudo/gi) !== -1 ? 'success' : (std.search(/-128/g) !== -1 ? 'cancel' : 'fail');
        events.emit('answer', event);
    };

    app.utils.sudo = module;

})(window.App, jQuery);