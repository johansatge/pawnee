/**
 * Editor view
 */
(function(app, $)
{

    'use strict';

    var module = function()
    {

        var window = null;
        var events = new app.node.events.EventEmitter();
        var virtual_host;
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
            window.on('close', $.proxy(_onCloseWindow, this));
        };

        /**
         * Focuses the view
         */
        this.focus = function()
        {
            window.focus();
        };

        /**
         * Closes the view
         */
        this.close = function()
        {
            window.close(true);
        };

        /**
         * Toggles the pending state of the view
         * @param is_pending
         */
        this.togglePendingState = function(is_pending)
        {
            $ui.body.find('.js-action').attr('disabled', is_pending ? 'disabled' : false);
        };

        /**
         * Triggered when the window content has been loaded (DOM and assets)
         */
        var _onWindowLoaded = function()
        {
            window.show();
            if (app.devMode)
            {
                window.showDevTools();
            }
            window.focus();
            $ui.body = $(window.window.document.body);
            $ui.body.html(app.utils.template.render($ui.body.html(), [app.locale.editor, virtual_host], true));
            $ui.body.find('.js-action').on('click', $.proxy(_onAction, this));
            if (virtual_host === false)
            {
                $ui.body.find('[data-action="delete"]').hide();
            }
        };

        /**
         * Users closes the window
         */
        var _onCloseWindow = function()
        {
            events.emit('close');
        };

        /**
         * Handles buttons click
         * @param evt
         */
        var _onAction = function(evt)
        {
            evt.preventDefault();
            var form_data = {};
            $ui.body.find('input[type="text"]').each(function()
            {
                var $input = $(this);
                form_data[$input.data('value')] = $input.val();
            });
            events.emit('action', $(evt.currentTarget).data('action'), form_data);
        };

    };

    app.views.editor = module;

})(window.App, jQuery);