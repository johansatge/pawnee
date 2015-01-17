/**
 * Panel view
 */
(function(app, $)
{

    'use strict';

    var module = function()
    {

        var window = null;
        var $panel = null;
        var events = new app.node.events.EventEmitter();
        var isVisible = false;
        var maxHeight = 0;
        var modulesView;
        var switcherView;

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
         */
        this.init = function()
        {
            var params = {toolbar: app.devMode, frame: false, transparent: true, resizable: false, show: false};
            window = app.node.gui.Window.open('templates/panel.html', params);
            window.on('document-end', $.proxy(_onWindowInited, this));
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
         * Toggles the pending state of the view - mostly used when doing stuff in the system
         * @param visible
         */
        this.togglePendingState = function(visible)
        {
            modulesView.togglePendingState(visible);
        };

        /**
         * Populates the list of modules in the child view
         * @param modules
         */
        this.setModules = function(modules)
        {
            modulesView.setModules(modules);
        };

        /**
         * Enables the main switcher
         * @param is_running
         */
        this.enableSwitcher = function(is_running)
        {
            switcherView.enable(is_running);
        };

        /**
         * Disables the main switcher
         */
        this.disableSwitcher = function()
        {
            switcherView.disable();
        };

        /**
         * Shows the window
         * @todo hide on blur
         * @param x
         * @param y
         */
        var _show = function(x, y)
        {
            window.moveTo(x - ($panel.width() / 2) - 6, y);
            _fitWindowToContent.apply(this);
            window.show();
            window.focus();
            if (app.devMode)
            {
                window.showDevTools();
            }
        };

        /**
         * Triggered when the window has been constructed (the DOM is ready, but the page is still loading)
         * @private
         */
        var _onWindowInited = function()
        {
            window.window.onload = $.proxy(_onWindowLoaded, this);
        };

        /**
         * Triggered when the window content has been loaded (DOM and assets)
         */
        var _onWindowLoaded = function()
        {
            $panel = $(window.window.document.body).find('.js-panel');

            _fitWindowToContent.apply(this);
            app.utils.window.disableDragDrop(window.window.document);

            _initModules();
            _initSwitcher();
            _initSections();

            events.emit('loaded');
        };

        /**
         * Inits the modules subview
         */
        var _initModules = function()
        {
            modulesView = new app.views.modules();
            modulesView.on('action', $.proxy(_onModulesAction, this));
            modulesView.init($panel.find('.js-modules-list'));
        };

        /**
         * Inits the switcher subview
         */
        var _initSwitcher = function()
        {
            switcherView = new app.views.switcher();
            switcherView.on('action', $.proxy(_onSwitcherAction, this));
            switcherView.init($panel);
        };

        /**
         * Inits section events
         */
        var _initSections = function()
        {
            $panel.find('.js-heading').on('click', $.proxy(_onToggleSection, this));
        };

        /**
         * Switcher action (restarts or toggles the server status)
         * @param action
         */
        var _onSwitcherAction = function(action)
        {
            events.emit('action', action);
        };

        /**
         * Toggles a module from the child view
         * @param action
         * @param data
         */
        var _onModulesAction = function(action, data)
        {
            events.emit('action', action, data);
        };

        /**
         * Toggles a section
         * @param evt
         */
        var _onToggleSection = function(evt)
        {
            evt.preventDefault();
            _fitWindowToContent.apply(this, [maxHeight]);
            var $section = $(evt.currentTarget).closest('.js-section');
            $section.toggleClass('js-closed').find('.js-content').slideToggle({duration: 200, complete: $.proxy(_fitWindowToContent, this)});
        };

        /**
         * Updates the size of the window depending on its content (or a forced height, if providden)
         * @param height
         */
        var _fitWindowToContent = function(height)
        {
            height = height || $panel.height() + 40;
            window.resizeTo($panel.width() + 40, height);
            maxHeight = height > maxHeight ? height : maxHeight;
        };

    };

    app.views.panel = module;

})(window.App, jQuery);