/**
 * Editor view
 */
(function(app, $)
{

    'use strict';

    var module = function()
    {

        var window = null;
        var $ui = {};
        var events = new app.node.events.EventEmitter();
        var virtual_host;

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
         * Inits the main window and waits for its content to be loaded
         * @param vhost
         */
        this.init = function(vhost)
        {
            virtual_host = vhost;
            var params = {toolbar: false, frame: true, resizable: false, show: false, width: 350, height: 310};
            window = app.node.gui.Window.open('templates/editor.html', params);
            window.on('document-end', function()
            {
                window.window.onload = $.proxy(_onWindowLoaded, this);
            });
        };

        /**
         * Triggered when the window content has been loaded (DOM and assets)
         * @todo refactor
         */
        var _onWindowLoaded = function()
        {
            window.show();
            if (app.devMode)
            {
                window.showDevTools();
            }
            window.focus();
            var $body = $(window.window.document.body);
            $body.html(app.utils.template.render($body.html(), [app.locale.editor, virtual_host]));
        };

    };

    app.views.editor = module;

})(window.App, jQuery);