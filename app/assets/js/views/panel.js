/**
 * Panel view
 */
(function(app, $)
{

    'use strict';

    var module = {};
    var window = null;
    var $panel = null;
    var events = new app.node.events.EventEmitter();
    var isVisible = false;
    var $ui = {};
    var templates = {};
    var maxHeight = 0;

    /**
     * Attaches an event
     * @param event
     * @param callback
     */
    module.on = function(event, callback)
    {
        events.on(event, callback);
    };

    /**
     * Show main window & inits events
     */
    module.init = function()
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
     * @todo check screen bounds
     * @todo hide on blur
     * @param x
     * @param y
     */
    module.toggle = function(x, y)
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
     * Populates the list of modules
     * @param modules
     */
    module.setModules = function(modules)
    {
        $ui.modulesList.children().remove();
        for (var index = 0; index < modules.length; index += 1)
        {
            var $html = $(app.utils.template.render(templates.module, modules[index]));
            $html.appendTo($ui.modulesList);
            $html.find('.js-checkbox').on('change', $.proxy(_onToggleModule, this));
        }
    };

    /**
     * Toggles a module
     */
    var _onToggleModule = function(evt)
    {
        var $checkbox = $(evt.currentTarget);
        events.emit('action', 'toggle_module', {module: $checkbox.val(), enable: $checkbox.is(':checked')});
    };

    /**
     * Loads the template when the view is ready and tells the controller
     */
    var _onWindowLoaded = function()
    {
        var $body = $(window.window.document.body);
        $panel = $body.find('.js-panel');
        $ui.switcher = $panel.find('.js-switcher');
        $ui.switch = $panel.find('.js-switch');
        $ui.restart = $panel.find('.js-restart');
        $ui.heading = $panel.find('.js-heading');
        $ui.search = $panel.find('.js-search');
        $ui.modulesList = $panel.find('.js-modules-list');
        templates.module = $panel.find('.js-module-template').html();
        app.utils.window.disableDragDrop($body);
        $ui.switcher.on('click', $.proxy(_onToggleSwitcher, this));
        $ui.restart.on('click', $.proxy(_onRestart, this));
        $ui.heading.on('click', $.proxy(_onToggleSection, this));
        $ui.search.on('keyup', $.proxy(_onSearchList, this));
        events.emit('loaded');
        _setWindowSize.apply(this);
    };

    /**
     * Toggles the main switcher
     * @param evt
     */
    var _onToggleSwitcher = function(evt)
    {
        evt.preventDefault();
        $ui.switch.toggleClass('js-off');
        events.emit('action', 'toggle_server');
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
     * Restarts the server
     * @param evt
     */
    var _onRestart = function(evt)
    {
        evt.preventDefault();
        events.emit('action', 'restart_server');
    };

    /**
     * Search in a list
     * @todo move in a separate view
     * @param evt
     */
    var _onSearchList = function(evt)
    {
        var $field = $(evt.currentTarget);
        var items = $field.closest('.js-content').find('.js-search-item').get();
        var search_term = $field.val();
        for (var index = 0; index < items.length; index += 1)
        {
            var $item = $(items[index]);
            $item.toggle($item.find('.js-search-value').text().search(search_term) !== -1);
        }
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

    app.views.panel = module;

})(window.App, jQuery);