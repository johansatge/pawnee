/**
 * Panel view
 */
(function(app, $)
{

    'use strict';

    var module = function()
    {

        var window = null;
        var $body = null;
        var events = new app.node.events.EventEmitter();
        var isVisible = false;
        var $ui = {};

        /**
         * Attaches an event
         * @param event
         * @param callback
         */
        this.on = function(event, callback)
        {
            events.on(event, callback);
        };

        /**
         * Show main window & inits events
         * @todo make window size dynamic
         */
        this.init = function()
        {
            var width = 500;
            var height = 450;
            var window_params =
            {
                toolbar: app.devMode,
                frame: false,
                width: width,
                height: height,
                transparent: true,
                position: 'mouse',
                resizable: false,
                show: false,
                title: ''
            };
            window = app.node.gui.Window.open('templates/panel.html', window_params);
            window.on('document-end', $.proxy(function()
            {
                window.window.onload = $.proxy(_onWindowLoaded, this);
            }, this));
        };

        /**
         * Toggles the view
         * @todo check screen bounds
         * @todo calculate position depending on dynamic window dimensions
         * @todo hide on blur
         * @param x
         * @param y
         */
        this.toggle = function(x, y)
        {
            if (!isVisible)
            {
                window.moveTo(x - 250 + 15, y);
                window.show();
                window.focus();
                if (app.devMode)
                {
                    window.showDevTools();
                }
            }
            else
            {
                window.hide();
            }
            isVisible = !isVisible;
        };

        /**
         * Loads the template when the view is ready and tells the controller
         */
        var _onWindowLoaded = function()
        {
            $body = $(window.window.document.body);
            $ui.switcher = $body.find('.js-switcher');
            $ui.switch = $body.find('.js-switch');
            app.disableDragDrop($body);
            $ui.switcher.on('click', $.proxy(_onToggleSwitcher, this));
            events.emit('loaded');
        };

        /**
         * Toggles the main switcher
         * @param evt
         */
        var _onToggleSwitcher = function(evt)
        {
            evt.preventDefault();
            $ui.switch.toggleClass('js-off');
        }

    };

    app.views.panel = module;

})(window.App, jQuery);