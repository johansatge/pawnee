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

    var watcher;

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
        app.utils.apache.server.toggleState(state, function()
        {
            _refreshConfiguration();
        });
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
        app.utils.apache.server.checkConfiguration(function()
        {
            _getModules();
        });
    };

    /**
     * Gets the modules list
     */
    var _getModules = function()
    {
        app.utils.apache.module.get(_getVirtualHosts);
    };

    /**
     * Gets the virtual hosts list
     * @param modules
     */
    var _getVirtualHosts = function(modules)
    {
        app.utils.apache.virtualhost.get(function(virtual_hosts)
        {
            _getPHPVersions(modules, virtual_hosts);
        });
    };

    /**
     * Gets PHP versions
     * @param modules
     * @param virtual_hosts
     */
    var _getPHPVersions = function(modules, virtual_hosts)
    {
        app.utils.apache.php.getVersions(function(php_versions)
        {
            _getPHPPackages(modules, virtual_hosts, php_versions);
        });
    };

    /**
     * Gets PHP packages
     * @param modules
     * @param virtual_hosts
     * @param php_versions
     */
    var _getPHPPackages = function(modules, virtual_hosts, php_versions)
    {
        app.utils.apache.php.getPackages(function(php_packages)
        {
            _emitConfiguration(modules, virtual_hosts, php_versions, php_packages);
        });
    };

    /**
     * Checks the status and emits the server configuration to the app
     * @param modules
     * @param virtual_hosts
     * @param php_versions
     */
    var _emitConfiguration = function(modules, virtual_hosts, php_versions, php_packages)
    {
        app.utils.apache.server.isRunning(function(is_running)
        {
            events.emit('idle', is_running, modules, virtual_hosts, php_versions, php_packages);
        });
    };

    app.models.apache = module;

})(window.App, jQuery);