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
            var height = 400;
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
            app.disableDragDrop($body);
            events.emit('loaded');
        };

    };

    app.views.panel = module;

})(window.App, jQuery);