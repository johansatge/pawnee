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
        this.show = function()
        {
            var window_params =
            {
                toolbar: app.devMode,
                frame: false,
                width: 400,
                height: 362,
                position: 'mouse',
                min_width: 400,
                min_height: 362,
                max_width: 400,
                max_height: 362,
                show: false,
                title: ''
            };
            window = app.node.gui.Window.open('templates/panel.html', window_params);
            window.on('document-end', $.proxy(function()
            {
                window.window.onload = $.proxy(onWindowLoaded, this);
            }, this));
        };

        /**
         * Loads the template when the view is ready
         */
        var onWindowLoaded = function()
        {
            window.menu = app.menubar;
            window.show();
            window.focus();
            $body = $(window.window.document.body);
            app.disableDragDrop($body);
        };

    };

    app.views.panel = module;

})(window.App, jQuery);