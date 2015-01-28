/**
 * Modules view
 */
(function(app, $)
{

    'use strict';

    var module = function()
    {

        var events = new app.node.events.EventEmitter();
        var $ui = {};
        var row_template;

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
         * Inits the modules list
         * @param $dom
         */
        this.init = function($dom)
        {
            row_template = $dom.find('.js-module-template').html();
            $dom.find('.js-search').on('keyup', $.proxy(_onSearchList, this));
            $ui.list = $dom.find('.js-list');
            $ui.loader = $dom.find('.js-load');
            $ui.loader.hide();
        };

        /**
         * Populates the list of modules
         * @param modules
         */
        this.setModules = function(modules)
        {
            $ui.list.children().remove();
            for (var index = 0; index < modules.length; index += 1)
            {
                var $html = $(app.utils.template.render(row_template, [modules[index]]));
                $html.appendTo($ui.list);
                $html.find('.js-checkbox').attr('checked', modules[index].enabled ? 'checked' : false).on('change', $.proxy(_onToggleModule, this));
            }
        };

        /**
         * Toggles a module
         * @param evt
         */
        var _onToggleModule = function(evt)
        {
            var $checkbox = $(evt.currentTarget);
            events.emit('action', 'toggle_module', {module: $checkbox.val(), enable: $checkbox.is(':checked')});
        };

        /**
         * Search
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

    };

    app.views.panel.module = module;

})(window.App, jQuery);