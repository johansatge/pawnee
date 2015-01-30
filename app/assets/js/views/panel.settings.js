/**
 * Settings view
 */
(function(app, $)
{

    'use strict';

    var module = function()
    {

        var events = new app.node.events.EventEmitter();
        var window;

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
         * Inits
         * @param $dom
         * @param window
         */
        this.init = function($dom, win)
        {
            window = win;
            $dom.on('click', $.proxy(_onToggleSettings, this));
        };

        /**
         * Toggles settings
         * @param evt
         */
        var _onToggleSettings = function(evt)
        {
            evt.preventDefault();
            var $button = $(evt.currentTarget);
            events.emit('action', 'toggle_settings', {x: window.x + $button.offset().left + ($button.width() / 2), y: $button.offset().top});
        };

    };

    app.views.panel.settings = module;

})(window.App, jQuery);