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
         * Toggles the pending state of the view
         * @param is_pending
         */
        this.togglePendingState = function(is_pending)
        {
            $ui.loader.toggle(is_pending);
            $ui.search.trigger('keyup');
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
         */
        var _onWindowLoaded = function()
        {
            var $body = $(window.window.document.body);
            $body.html(app.utils.template.render($body.html(), [app.locale]));

            _initUI.apply(this, [$body]);
            _initSubviews.apply(this);
            _fitWindowToContent.apply(this);
            _initSectionsAndSettings.apply(this);

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
         * Inits ui
         * @param $body
         */
        var _initUI = function($body)
        {
            $ui.panel = $body.find('.js-panel');
            $ui.activity = $ui.panel.find('.js-activity');
            $ui.loader = $ui.panel.find('.js-load');
            $ui.search = $ui.panel.find('.js-search input');
            app.utils.window.disableDragDrop(window.window.document);
        };

        /**
         * Inits the subviews
         */
        var _initSubviews = function()
        {
            var $module = $ui.panel.find('.js-modules');
            this.module = new app.views.panel.module();
            this.module.on('action', $.proxy(_onSubviewAction, this)).init($module);
            _toggleSection($module, 0);

            var $vhost = $ui.panel.find('.js-vhosts');
            this.virtualhost = new app.views.panel.virtualhost();
            this.virtualhost.on('action', $.proxy(_onSubviewAction, this)).init($vhost);
            _toggleSection($vhost, 0);

            this.switcher = new app.views.panel.switcher();
            this.switcher.on('action', $.proxy(_onSubviewAction, this)).init($ui.panel);
        };

        /**
         * Inits sections and settings
         */
        var _initSectionsAndSettings = function()
        {
            $ui.panel.find('.js-heading').on('click', $.proxy(_onToggleSection, this));
            $ui.panel.find('.js-clear').on('click', $.proxy(_onClearSection, this));
            $ui.panel.find('.js-settings').on('click', $.proxy(_onToggleSettings, this));
            $ui.search.on('keyup', $.proxy(_onSearchList, this)).on('click', function(evt)
            {
                evt.stopPropagation();
            });
        };

        /**
         * Search
         * @param evt
         */
        var _onSearchList = function(evt)
        {
            var $field = $(evt.currentTarget);
            var items = $field.closest('.js-section').find('.js-search-item').get();
            var search_term = $field.val();
            for (var index = 0; index < items.length; index += 1)
            {
                var $item = $(items[index]);
                $item.toggle($item.find('.js-search-value').text().search(search_term) !== -1);
            }
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
         * Toggles a section when clicking on a heading area
         * @param evt
         */
        var _onToggleSection = function(evt)
        {
            evt.preventDefault();
            _fitWindowToContent.apply(this, [maxHeight]);
            _toggleSection($(evt.currentTarget).closest('.js-section'));
        };

        /**
         * Toggles a section
         * @param $section
         * @param speed
         * @private
         */
        var _toggleSection = function($section, speed)
        {
            speed = speed || 200;
            $section.toggleClass('js-closed').find('.js-content').slideToggle({duration: speed, complete: $.proxy(_fitWindowToContent, this)});
            $section.find('.js-search').fadeToggle(speed);
            $section.find('.js-action').fadeToggle(speed);
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
         * Toggles settings
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