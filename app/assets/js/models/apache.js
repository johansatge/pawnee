/**
 * Apache model
 */
(function(app, $)
{

    'use strict';

    var module = {};
    var events = new app.node.events.EventEmitter();
    module.confPath = '/etc/apache2/httpd.conf';
    module.backupConfPath = '/etc/apache2/httpd.pawnee-backup.conf';
    module.modulesPath = '/usr/libexec/apache2/';
    module.relativeModulesPath = 'libexec/apache2/';
    module.phpModuleDirective = 'LoadModule php$1_module /usr/local/opt/$2/libexec/apache2/libphp$3.so';
    module.brewPath = '/usr/local/bin/brew';

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
        app.utils.apache.conf.watchFile(_onConfigUpdate);
        _refreshConfiguration();
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
        app.utils.apache.virtualhost.set(virtual_host, data);
    };

    /**
     * Deletes a virtual host
     * @param virtual_host
     */
    module.deleteVirtualHost = function(virtual_host)
    {
        events.emit('busy');
        app.utils.apache.virtualhost.delete(virtual_host);
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
    var _onConfigUpdate = function()
    {
        events.emit('busy');
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
    };

    /**
     * Handles the end of a process
     * @param data
     */
    var _handleRefreshProcess = function(data)
    {
        $.extend(refreshData, data);
        var missing_data = false;
        var required_data = ['modules', 'virtual_hosts', 'php_versions'];
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