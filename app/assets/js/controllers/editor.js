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
         * @param virtual_host
         */
        this.load = function(virtual_host)
        {
            view = new app.views.editor();
            view.on('action', $.proxy(_onViewAction, this));
            view.init(virtual_host);
        };

        /**
         * Fired when an action is called from the view
         * @param action
         * @param data
         */
        var _onViewAction = function(action, data)
        {
            app.log(action);
            app.log(data);
        };

    };

    app.controllers.editor = module;

})(window.App, jQuery);