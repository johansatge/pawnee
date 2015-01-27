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
        var modulesView;
        var switcherView;
        var virtualHostsView;

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
            window.on('document-end', function()
            {
                window.window.onload = $.proxy(_onWindowLoaded, this);
            });
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
            virtualHostsView.togglePendingState(visible);
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
         * Populates the list of virtual hosts in the child view
         * @param virtual_hosts
         */
        this.setVirtualHosts = function(virtual_hosts)
        {
            virtualHostsView.setHosts(virtual_hosts);
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
         * Logs activity
         * @param message
         */
        this.logActivity = function(message)
        {
            $ui.activity.val($ui.activity.val() + "\n" + message);
            $ui.activity.scrollTop($ui.activity[0].scrollHeight - $ui.activity.height());
        };

        /**
         * Shows the window
         * @todo hide on blur
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
         * @todo refactor
         */
        var _onWindowLoaded = function()
        {
            var $body = $(window.window.document.body);
            $body.html(app.utils.template.render($body.html(), [app.locale]));

            $ui.panel = $(window.window.document.body).find('.js-panel');
            $ui.activity = $ui.panel.find('.js-activity');

            app.utils.window.disableDragDrop(window.window.document);

            _initSubviews();
            _fitWindowToContent.apply(this);
            _initSectionsAndSettings();

            events.emit('loaded');
        };

        /**
         * Inits the subviews
         */
        var _initSubviews = function()
        {
            modulesView = new app.views.panel.module();
            modulesView.on('action', $.proxy(_onSubviewAction, this));
            modulesView.init($ui.panel.find('.js-modules-list'));

            virtualHostsView = new app.views.panel.virtualhost();
            virtualHostsView.on('action', $.proxy(_onSubviewAction, this));
            virtualHostsView.init($ui.panel.find('.js-vhosts'));

            switcherView = new app.views.panel.switcher();
            switcherView.on('action', $.proxy(_onSubviewAction, this));
            switcherView.init($ui.panel);
        };

        /**
         * Inits sections and settings
         */
        var _initSectionsAndSettings = function()
        {
            $ui.panel.find('.js-heading').on('click', $.proxy(_onToggleSection, this));
            $ui.panel.find('.js-clear').on('click', $.proxy(_onClearSection, this));
            $ui.panel.find('.js-settings').on('click', $.proxy(_onToggleSettings, this));
            $ui.panel.find('.js-closed .js-content').slideUp(0);
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
         * Clears a section
         * @param evt
         * @private
         */
        var _onClearSection = function(evt)
        {
            evt.preventDefault();
            evt.stopPropagation();
            $(evt.currentTarget).closest('.js-section').find('.js-clearable').val('');
        };

        /**
         * Toggle settings
         * @param evt
         */
        var _onToggleSettings = function(evt)
        {
            evt.preventDefault();
            var $button = $(evt.currentTarget);
            events.emit('action', 'toggle_settings', {x: window.x + $button.offset().left + ($button.width() / 2), y: $button.offset().top});
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