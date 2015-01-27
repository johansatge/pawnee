/**
 * Editor controller
 */
(function(app, $)
{

    'use strict';

    var module = function()
    {

        var events = new app.node.events.EventEmitter();
        var view;
        var virtual_host;

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
         * Inits the controller
         * @param vhost
         */
        this.load = function(vhost)
        {
            virtual_host = vhost;
            view = new app.views.editor();
            view.on('action', $.proxy(_onViewAction, this));
            view.init(virtual_host);
        };

        /**
         * Closes the view
         */
        this.close = function()
        {
            view.close();
        };

        /**
         * Fired when an action is called from the view
         * @param action
         * @param data
         */
        var _onViewAction = function(action, data)
        {
            events.emit('action', this, action, virtual_host, data);
        };

    };

    app.controllers.editor = module;

})(window.App, jQuery);