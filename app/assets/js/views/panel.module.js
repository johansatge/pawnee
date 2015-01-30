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
            $ui.list = $dom.find('.js-list');
            $ui.loader = $dom.find('.js-load');
            $ui.loader.hide();
        };

        /**
         * Toggles the pending state of the view
         * @param is_pending
         */
        this.togglePendingState = function(is_pending)
        {
            $ui.loader.toggle(is_pending);
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

    };

    app.views.panel.module = module;

})(window.App, jQuery);