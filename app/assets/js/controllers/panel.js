/**
 * Panel controller
 */
(function(app, $)
{

    'use strict';

    var module = function()
    {

        var events = new app.node.events.EventEmitter();
        var view;
        var settings;

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
         * Logs activity
         * @param message
         */
        this.logActivity = function(message)
        {
            view.logActivity(message);
        };

        /**
         * Inits the controller
         */
        this.load = function()
        {
            view = new app.views.panel.main();
            view.init();
            view.on('loaded', $.proxy(_onViewLoaded, this));
            view.on('action', $.proxy(_onViewAction, this));
            settings = new app.controllers.settings();
            settings.init();
        };

        /**
         * Toggles the view
         * @param x
         * @param y
         */
        this.toggle = function(x, y)
        {
            view.toggle(x, y);
        };

        /**
         * Starts watching Apache files when the view is ready
         */
        var _onViewLoaded = function()
        {
            events.emit('loaded');
            app.models.apache.on('working', $.proxy(_onApacheWorking, this));
            app.models.apache.on('idle', $.proxy(_onApacheIdle, this));
            app.models.apache.watchFiles();
        };

        /**
         * Starts doing Apache CLI stuff (when a file changes, or if the user asked to do something)
         */
        var _onApacheWorking = function()
        {
            view.togglePendingState(true);
            view.disableSwitcher();
        };

        /**
         * Stops doing Apache CLI stuff
         * @param is_running
         * @param modules
         * @param virtual_hosts
         */
        var _onApacheIdle = function(is_running, modules, virtual_hosts)
        {
            view.setModules(modules);
            view.setVirtualHosts(virtual_hosts);
            view.togglePendingState(false);
            view.enableSwitcher(is_running);
        };

        /**
         * Handles view actions
         * @param action
         * @param data
         */
        var _onViewAction = function(action, data)
        {
            if (action === 'start_server' || action === 'stop_server' || action === 'restart_server')
            {
                app.models.apache.toggleServerState(action.split('_')[0]);
            }
            if (action === 'toggle_module')
            {
                app.models.apache.toggleModuleState(data.module, data.enable);
            }
            if (action === 'toggle_settings')
            {
                settings.popup(data.x, data.y);
            }
            if (action === 'edit_vhost')
            {
                var editor = new app.controllers.editor();
                editor.on('action', $.proxy(_onEditorAction, this));
                editor.load(data);
            }
            if (action === 'add_vhost')
            {
                app.log('@todo add vhost');
            }
        };

        /**
         * Handles editor actions
         * @todo block actions if apache is already working
         * @param editor
         * @param action
         * @param virtual_host
         * @param data
         */
        var _onEditorAction = function(editor, action, virtual_host, data)
        {
            editor.close();
            if (action === 'save')
            {
                app.models.apache.editVirtualHost(virtual_host, data);
            }
            if (action === 'delete')
            {
                app.models.apache.deleteVirtualHost(virtual_host);
            }
        };

    };

    app.controllers.panel = module;

})(window.App, jQuery);