/**
 * Switcher view
 */
(function(app, $)
{

    'use strict';

    var module = function()
    {

        var events = new app.node.events.EventEmitter();
        var $ui = {};

        /**
         * Attaches an event
         * @param event
         * @param callback
         */
        this.on = function(event, callback)
        {
            events.on(event, callback);
            return this;
        };

        /**
         * Inits the switcher
         * @param $dom
         */
        this.init = function($dom)
        {
            $ui.switcher = $dom.find('.js-switcher');
            $ui.switch = $dom.find('.js-switch');
            $ui.restart = $dom.find('.js-restart');

            $ui.switcher.on('click', $.proxy(_onToggleSwitcher, this));
            $ui.restart.on('click', $.proxy(_onRestart, this));
        };

        /**
         * Enables actions
         * @param is_running
         */
        this.setPosition = function(is_running)
        {
            $ui.switch.toggleClass('js-off', !is_running);
        };

        /**
         * Toggles the main switcher
         * @param evt
         */
        var _onToggleSwitcher = function(evt)
        {
            evt.preventDefault();
            events.emit('action', $ui.switch.hasClass('js-off') ? 'start_server' : 'stop_server');
        };

        /**
         * Restarts the server
         * @param evt
         */
        var _onRestart = function(evt)
        {
            evt.preventDefault();
            events.emit('action', 'restart_server');
        };

    };

    app.views.panel.switcher = module;

})(window.App, jQuery);