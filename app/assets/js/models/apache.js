/**
 * Apache model
 */
(function(app, $)
{

    'use strict';

    var module = {};
    var events = new app.node.events.EventEmitter();
    module.confPath = '/etc/apache2/httpd.conf';
    module.modulesPath = '/usr/libexec/apache2/';
    module.relativeModulesPath = 'libexec/apache2/';
    module.phpModuleDirective = 'LoadModule php5_module /usr/local/opt/%s/libexec/apache2/libphp5.so';

    var watcher;
    var refreshData;

    /**
     * Attaches an event
     * @param event
     * @param callback
     */
    module.on = function(event, callback)
    {
        events.on(event, callback);
        return this;
    };

    /**
     * Starts watching files
     */
    module.watchFiles = function()
    {
        watcher = app.node.watcher.watch(app.models.apache.confPath, {persistent: true});
        watcher.add(app.models.apache.modulesPath);
        watcher.on('change', _onWatcherUpdate);
        watcher.on('ready', _onWatcherUpdate);
        app.logActivity(app.locale.apache.watch.replace('%s', app.models.apache.confPath));
        app.logActivity(app.locale.apache.watch.replace('%s', app.models.apache.modulesPath));
    };

    /**
     * Stops watching files
     */
    module.unwatchFiles = function()
    {
        //watcher.close();
    };

    /**
     * Toggles the server state (start, stop, restart)
     * @param state
     */
    module.toggleServerState = function(state)
    {
        events.emit('working');
        app.utils.apache.server.toggleState(state, _refreshConfiguration);
    };

    /**
     * Toggles the state of a module
     * @param module
     * @param enable
     */
    module.toggleModuleState = function(module, enable)
    {
        events.emit('working');
        app.utils.apache.module.toggleState(module, enable);
    };

    /**
     * Sets a virtual host (adds or edits)
     * @param virtual_host
     * @param data
     */
    module.setVirtualHost = function(virtual_host, data)
    {
        events.emit('working');
        app.utils.apache.virtualhost.set(virtual_host, data, _refreshConfiguration);
    };

    /**
     * Deletes a virtual host
     * @param virtual_host
     */
    module.deleteVirtualHost = function(virtual_host)
    {
        events.emit('working');
        app.utils.apache.virtualhost.delete(virtual_host, _refreshConfiguration);
    };

    /**
     * Sets the current PHP verison
     * @param version
     */
    module.setPHPVersion = function(version)
    {
        events.emit('working');
        app.utils.apache.php.setVersion(version, _refreshConfiguration);
    };

    /**
     * Restarts the server when a config file changes (if already running)
     */
    var _onWatcherUpdate = function()
    {
        events.emit('working');
        app.logActivity(app.locale.apache.filechange);
        app.utils.apache.server.isRunning(function(is_running)
        {
            if (is_running)
            {
                app.utils.apache.server.toggleState('restart', _refreshConfiguration);
            }
            else
            {
                _refreshConfiguration();
            }
        });
    };

    /**
     * Asynchronously refreshes the configuration and sends an event when it's done
     */
    var _refreshConfiguration = function()
    {
        refreshData = {};
        app.utils.apache.server.checkConfiguration(_handleRefreshProcess);
        app.utils.apache.module.get(_handleRefreshProcess);
        app.utils.apache.virtualhost.get(_handleRefreshProcess);
        app.utils.apache.php.getVersions(_handleRefreshProcess);
        app.utils.apache.php.getPackages(_handleRefreshProcess);
        app.utils.apache.server.isRunning(_handleRefreshProcess);
    };

    /**
     * Handles the end of a process
     * @param data
     */
    var _handleRefreshProcess = function(data)
    {
        $.extend(refreshData, data);
        var missing_data = false;
        var required_data = ['is_running', 'modules', 'virtual_hosts', 'php_versions', 'php_packages'];
        for (var index = 0; index < required_data.length; index += 1)
        {
            if (typeof refreshData[required_data[index]] === 'undefined')
            {
                missing_data = true;
                break;
            }
        }
        if (!missing_data)
        {
            events.emit('idle', refreshData);
        }
    };

    app.models.apache = module;

})(window.App, jQuery);