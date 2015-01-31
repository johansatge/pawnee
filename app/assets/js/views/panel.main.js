/**
 * Panel view
 */
(function(app, $)
{

    'use strict';

    var module = function()
    {

        var window = null;
        var $ui = {};
        var events = new app.node.events.EventEmitter();
        var isVisible = false;
        var maxHeight = 0;

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
         * Inits the main window and waits for its content to be loaded
         */
        this.init = function()
        {
            var params = {toolbar: app.devMode, frame: false, transparent: true, resizable: false, show: false};
            window = app.node.gui.Window.open('templates/panel.html', params);
            var self = this;
            window.on('document-end', function()
            {
                window.window.onload = $.proxy(_onWindowLoaded, self);
            });
            window.on('blur', $.proxy(_onWindowBlur, this));
        };

        /**
         * Toggles the window
         * @param x
         * @param y
         */
        this.toggle = function(x, y)
        {
            isVisible ? window.hide() : _show.apply(this, [x, y]);
            isVisible = !isVisible;
        };

        /**
         * Shows the window
         * @param x
         * @param y
         */
        var _show = function(x, y)
        {
            window.moveTo(x - ($ui.panel.width() / 2) - 6, y);
            _fitWindowToContent.apply(this);
            window.show();
            if (app.devMode)
            {
                window.showDevTools();
            }
            window.focus();
        };

        /**
         * Triggered when the window content has been loaded (DOM and assets)
         */
        var _onWindowLoaded = function()
        {
            var $body = $(window.window.document.body);
            $body.html(app.utils.template.render($body.html(), [app.locale]));
            $ui.panel = $body.find('.js-panel');

            app.utils.window.disableDragDrop(window.window.document);
            _fitWindowToContent.apply(this);

            this.search = new app.views.panel.search();
            this.search.init($ui.panel.find('.js-search input'));

            this.module = new app.views.panel.module();
            this.module.on('action', $.proxy(_onSubviewAction, this)).init($ui.panel.find('.js-modules'));

            this.virtualhost = new app.views.panel.virtualhost();
            this.virtualhost.on('action', $.proxy(_onSubviewAction, this)).init($ui.panel.find('.js-vhosts'));

            this.php = new app.views.panel.php();
            this.php.on('action', $.proxy(_onSubviewAction, this)).init($ui.panel.find('.js-php'));

            this.section = new app.views.panel.section();
            this.section.on('resize', $.proxy(_onResizeSection, this)).init($ui.panel.find('.js-section'));

            this.switcher = new app.views.panel.switcher();
            this.switcher.on('action', $.proxy(_onSubviewAction, this)).init($ui.panel);

            this.settings = new app.views.panel.settings();
            this.settings.on('action', $.proxy(_onSubviewAction, this)).init($ui.panel.find('.js-settings'), window);

            this.activity = new app.views.panel.activity();
            this.activity.init($ui.panel.find('.js-activity'));

            events.emit('loaded');
        };

        /**
         * Hides the panel on blur
         */
        var _onWindowBlur = function()
        {
            if (!app.devMode)
            {
                window.hide();
                isVisible = false;
            }
        };

        /**
         * Resizes the window when a section is modified
         */
        var _onResizeSection = function()
        {
            _fitWindowToContent.apply(this, [maxHeight]);
        };

        /**
         * Handles an action in a subview and sends it to the controller
         * @param action
         * @param data
         */
        var _onSubviewAction = function(action, data)
        {
            events.emit('action', action, data);
        };

        /**
         * Updates the size of the window depending on its content (or a forced height, if providden)
         * @param height
         */
        var _fitWindowToContent = function(height)
        {
            height = height || $ui.panel.height() + 40;
            window.resizeTo($ui.panel.width() + 40, height);
            maxHeight = height > maxHeight ? height : maxHeight;
        };

    };

    app.views.panel.main = module;

})(window.App, jQuery);