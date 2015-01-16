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
         * Show main window & inits events
         */
        this.init = function()
        {
            var window_params =
            {
                toolbar: app.devMode,
                frame: false,
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
         * @todo check screen bounds & make dimensions dynamic
         * @todo hide on blur
         * @param x
         * @param y
         */
        this.toggle = function(x, y)
        {
            if (!isVisible)
            {
                window.moveTo(x - 250 + 15, y);
                _setWindowSize.apply(this);
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
         * Populates the list of modules in the child view
         * @param modules
         */
        this.setModules = function(modules)
        {
            modulesView.setModules(modules);
        };

        /**
         * Loads the template when the view is ready and tells the controller
         */
        var _onWindowLoaded = function()
        {
            var $body = $(window.window.document.body);

            modulesView = new app.views.modules();
            modulesView.on('action', $.proxy(_onModulesAction, this));
            modulesView.init($body.find('.js-modules-list'));

            switcherView = new app.views.switcher();
            switcherView.on('action', $.proxy(_onSwitcherAction, this));
            switcherView.init($body);

            app.utils.window.disableDragDrop($body);

            $panel = $body.find('.js-panel');
            $panel.find('.js-heading').on('click', $.proxy(_onToggleSection, this));
            events.emit('loaded');
            _setWindowSize.apply(this);
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
            var $heading = $(evt.currentTarget);
            _setWindowSize.apply(this, [maxHeight]);
            $heading.closest('.js-section').toggleClass('js-closed').find('.js-content').slideToggle({
                duration: 200,
                easing: 'linear',
                complete: $.proxy(_setWindowSize, this)
            });
        };

        /**
         * Updates the size of the window depending on its content
         * @param height
         * @private
         */
        var _setWindowSize = function(height)
        {
            height = height || $panel.height() + 40;
            window.resizeTo($panel.width() + 40, height);
            if (height > maxHeight)
            {
                maxHeight = height;
            }
        };

    };

    app.views.panel = module;

})(window.App, jQuery);