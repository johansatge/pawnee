/**
 * Virtual hosts view
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
        };

        /**
         * Inits the modules list
         * @param $dom
         */
        this.init = function($dom)
        {
            row_template = $dom.find('.js-vhost-template').html();
            $dom.find('.js-search').on('keyup', $.proxy(_onSearchList, this));
            $dom.find('.js-add').on('click', $.proxy(_onAddHost, this));
            $ui.list = $dom.find('.js-list');
            $ui.loader = $dom.find('.js-load');
            $ui.loader.hide();
        };

        /**
         * Populates the list of vhosts
         * @param virtual_hosts
         */
        this.setHosts = function(virtual_hosts)
        {
            $ui.list.children().remove();
            for (var index = 0; index < virtual_hosts.length; index += 1)
            {
                var $html = $(app.utils.template.render(row_template, virtual_hosts[index]));
                $html.appendTo($ui.list);
                $html.find('.js-edit').on('click', $.proxy(_onEditVirtualHost, this));
                $html.get(0).vhost = virtual_hosts[index];
            }
        };

        /**
         * Toggles the pending state of the view
         * @param visible
         */
        this.togglePendingState = function(visible)
        {
            $ui.loader.toggle(visible);
        };

        /**
         * Search
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
         * Edits a vhost
         * @param evt
         */
        var _onEditVirtualHost = function(evt)
        {
            evt.preventDefault();
            events.emit('action', 'edit_vhost', $(evt.currentTarget).closest('.js-vhost').get(0).vhost);
            app.log('@todo edit vhost');
        };

        /**
         * Adds a host
         * @param evt
         */
        var _onAddHost = function(evt)
        {
            evt.preventDefault();
            evt.stopPropagation();
            app.log('@todo add vhost');
        };

    };

    app.views.virtualhost = module;

})(window.App, jQuery);