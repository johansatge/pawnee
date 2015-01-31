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
            return this;
        };

        /**
         * Inits the modules list
         * @param $dom
         */
        this.init = function($dom)
        {
            row_template = $dom.find('.js-vhost-template').html();
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
                var $html = $(app.utils.template.render(row_template, [virtual_hosts[index]]));
                $html.appendTo($ui.list);
                $html.find('.js-edit').on('click', $.proxy(_onEditVirtualHost, this));
                $html.get(0).vhost = virtual_hosts[index];
            }
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
         * Edits a vhost
         * @param evt
         */
        var _onEditVirtualHost = function(evt)
        {
            evt.preventDefault();
            events.emit('action', 'edit_vhost', $(evt.currentTarget).closest('.js-vhost').get(0).vhost);
        };

        /**
         * Adds a host
         * @param evt
         */
        var _onAddHost = function(evt)
        {
            evt.preventDefault();
            evt.stopPropagation();
            events.emit('action', 'add_vhost');
        };

    };

    app.views.panel.virtualhost = module;

})(window.App, jQuery);