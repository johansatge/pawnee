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
     * Starts watching files & process
     */
    module.watch = function()
    {
        app.utils.apache.server.watchProcess(_onProcessUpdate);
        watcher = app.node.watcher.watch(app.models.apache.confPath, {persistent: true});
        watcher.add(app.models.apache.modulesPath);
        app.logActivity(app.locale.apache.watch.replace('%s', app.models.apache.confPath));
        app.logActivity(app.locale.apache.watch.replace('%s', app.models.apache.modulesPath));
        watcher.on('change', _onWatcherUpdate);
        watcher.on('ready', _refreshConfiguration);
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
        events.emit('busy');
        app.utils.apache.server.toggleState(state, _refreshConfiguration);
    };

    /**
     * Toggles the state of a module
     * @param module
     * @param enable
     */
    module.toggleModuleState = function(module, enable)
    {
        events.emit('busy');
        app.utils.apache.module.toggleState(module, enable);
    };

    /**
     * Sets a virtual host (adds or edits)
     * @param virtual_host
     * @param data
     */
    module.setVirtualHost = function(virtual_host, data)
    {
        events.emit('busy');
        app.utils.apache.virtualhost.set(virtual_host, data, _refreshConfiguration);
    };

    /**
     * Deletes a virtual host
     * @param virtual_host
     */
    module.deleteVirtualHost = function(virtual_host)
    {
        events.emit('busy');
        app.utils.apache.virtualhost.delete(virtual_host, _refreshConfiguration);
    };

    /**
     * Sets the current PHP verison
     * @param version
     */
    module.setPHPVersion = function(version)
    {
        events.emit('busy');
        app.utils.apache.php.setVersion(version, _refreshConfiguration);
    };

    /**
     * Restarts the server when a config file changes (if already running) and refreshes the configuration
     */
    var _onWatcherUpdate = function()
    {
        events.emit('busy');
        app.logActivity(app.locale.apache.filechange);
        app.utils.apache.server.isRunning() ? app.utils.apache.server.toggleState('restart', _refreshConfiguration) : _refreshConfiguration();
    };

    /**
     * Handles a process change (starts / stops)
     * @param is_running
     */
    var _onProcessUpdate = function(is_running)
    {
        events.emit('status', is_running);
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
    };

    /**
     * Handles the end of a process
     * @param data
     */
    var _handleRefreshProcess = function(data)
    {
        $.extend(refreshData, data);
        var missing_data = false;
        var required_data = ['modules', 'virtual_hosts', 'php_versions', 'php_packages'];
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
            events.emit('refresh', refreshData);
        }
    };

    app.models.apache = module;

})(window.App, jQuery);