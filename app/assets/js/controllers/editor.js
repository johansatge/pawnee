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
            view.on('close', $.proxy(_onViewClose, this));
            view.init(virtual_host);
        };

        /**
         * Focuses the view
         */
        this.focus = function()
        {
            view.focus();
        };

        /**
         * Closes the view
         */
        this.close = function()
        {
            view.close();
        };

        /**
         * Toggles the pending state of the view
         * @param is_pending
         */
        this.togglePendingState = function(is_pending)
        {
            view.togglePendingState(is_pending);
        };

        /**
         * Triggered when the window is closed
         * @private
         */
        var _onViewClose = function()
        {
            events.emit('action', this, 'close', virtual_host);
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