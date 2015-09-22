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
        var editors = {};

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
            view.activity.logActivity(message);
        };

        /**
         * Inits the controller
         */
        this.load = function()
        {
            view = new app.views.panel.main();
            view.on('loaded', $.proxy(_onViewLoaded, this)).on('action', $.proxy(_onViewAction, this)).init();
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
            app.models.apache.on('busy', $.proxy(_onApacheWorking, this));
            app.models.apache.on('refresh', $.proxy(_onApacheIdle, this));
            app.models.apache.on('status', $.proxy(_onApacheStatus, this));
            app.models.apache.watch();
        };

        /**
         * Starts doing Apache CLI stuff (when a file changes, or if the user asked to do something)
         */
        var _onApacheWorking = function()
        {
            view.php.togglePendingState(true);
            view.module.togglePendingState(true);
            view.virtualhost.togglePendingState(true);
            for (var index in editors)
            {
                editors[index].togglePendingState(true);
            }
        };

        /**
         * Stops doing Apache CLI stuff
         * @param data
         */
        var _onApacheIdle = function(data)
        {
            view.php.togglePendingState(false);
            view.php.setVersions(data.php_versions);
            view.module.togglePendingState(false);
            view.virtualhost.togglePendingState(false);
            view.module.setModules(data.modules);
            view.virtualhost.setHosts(data.virtual_hosts);
            view.search.refresh();
            for (var index in editors)
            {
                editors[index].togglePendingState(false);
            }
        };

        /**
         * Handles a new Apache status
         * @param is_running
         */
        var _onApacheStatus = function(is_running)
        {
            view.switcher.setPosition(is_running);
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
                if (typeof editors[data.id] === 'undefined')
                {
                    editors[data.id] = new app.controllers.editor();
                    editors[data.id].on('action', $.proxy(_onEditorAction, this));
                    editors[data.id].load(data);
                }
                else
                {
                    editors[data.id].focus();
                }
            }
            if (action === 'add_vhost')
            {
                var editor = new app.controllers.editor();
                editor.on('action', $.proxy(_onEditorAction, this));
                editor.load(false);
            }
            if (action === 'php_version')
            {
                app.models.apache.setPHPVersion(data);
            }
        };

        /**
         * Handles editor actions
         * @param editor
         * @param action
         * @param virtual_host
         * @param data
         */
        var _onEditorAction = function(editor, action, virtual_host, data)
        {
            if (action === 'save')
            {
                app.models.apache.setVirtualHost(virtual_host, data);
            }
            if (action === 'delete')
            {
                app.models.apache.deleteVirtualHost(virtual_host);
            }
            editor.close();
            delete editors[virtual_host.id];
        };

    };

    app.controllers.panel = module;

})(window.App, jQuery);