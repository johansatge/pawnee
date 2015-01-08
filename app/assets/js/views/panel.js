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
         */
        this.init = function()
        {
            var window_params =
            {
                toolbar: app.devMode,
                frame: false,
                width: 460,
                height: 300,
                transparent: true,
                position: 'mouse',
                min_width: 460,
                min_height: 300,
                max_width: 460,
                max_height: 300,
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
         * Loads the template when the view is ready and tells the controller
         */
        var _onWindowLoaded = function()
        {
            $body = $(window.window.document.body);
            app.disableDragDrop($body);
            events.emit('loaded');
        };

        /**
         * Toggles the view
         * @todo check screen bounds
         * @todo hide on blur
         * @param x
         * @param y
         */
        this.toggle = function(x, y)
        {
            if (!isVisible)
            {
                window.moveTo(x, y);
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

    };

    app.views.panel = module;

})(window.App, jQuery);