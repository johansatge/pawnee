/**
 * Apache utils
 * @todo handle errors and output when doing shell scripts
 */
(function(app)
{

    'use strict';

    var module = {};

    var events = new app.node.events.EventEmitter();
    var confPath = '/etc/apache2/httpd.conf';
    var modulesPath = '/usr/libexec/apache2/';
    var relativeModulesPath = 'libexec/apache2/';

    /**
     * Attaches an event
     * @param event
     * @param callback
     */
    module.on = function(event, callback)
    {
        events.on(event, callback);
    };

    /**
     * Starts or stops the server depending on its current state
     */
    module.start = function()
    {
        events.emit('working');
        app.logActivity(app.locale.apache.start);
        app.node.exec('sudo apachectl start', function(error, stdout, stderr)
        {
            _requestConfigurationRefresh();
        });
    };

    module.stop = function()
    {
        events.emit('working');
        app.logActivity(app.locale.apache.stop);
        app.node.exec('sudo apachectl stop', function(error, stdout, stderr)
        {
            _requestConfigurationRefresh();
        });
    };

    /**
     * Restarts the server
     */
    module.restart = function()
    {
        events.emit('working');
        app.logActivity(app.locale.apache.restart);
        app.node.exec('sudo apachectl restart', function()
        {
            _requestConfigurationRefresh();
        });
    };

    /**
     * Toggles the state of a module
     * The watcher will automatically restart the server on file change
     * @param module
     * @param enable
     */
    module.toggleModule = function(module, enable)
    {
        events.emit('working');
        app.logActivity(app.locale.apache[enable ? 'enable_module' : 'disable_module'].replace('%s', module));
        app.node.exec('cat ' + confPath, function(error, stdout, stderr) // @todo backup httpd.conf & handle errors
        {
            var added_httpd = 'LoadModule ' + module + '_module ' + relativeModulesPath + 'mod_' + module + '.so' + "\n" + stdout;
            var removed_httpd = stdout.replace(new RegExp('LoadModule\\s' + module + '_module\\s.*?\\.so\n', 'gi'), '');
            app.node.exec('sudo cat << "EOF" > ' + confPath + "\n" + (enable ? added_httpd : removed_httpd) + 'EOF', function(error, stdout, stderr) // @todo handle errors
            {

            });
        });
    };

    /**
     * Starts watching files
     */
    module.watch = function()
    {
        var watcher = app.node.watcher.watch(confPath, {persistent: true});
        watcher.add(modulesPath);
        watcher.on('change', _onFileChange);
        watcher.on('ready', _onFileChange);
        app.logActivity(app.locale.apache.watch.replace('%s', confPath));
        app.logActivity(app.locale.apache.watch.replace('%s', modulesPath));
    };

    /**
     * Restarts the server when a config file changes (if already running)
     */
    var _onFileChange = function()
    {
        events.emit('working');
        app.logActivity(app.locale.apache.filechange);
        app.utils.shell.isProcessRunning('/usr/sbin/httpd', function(is_running)
        {
            (is_running ? module.restart : _requestConfigurationRefresh)();
        });
    };

    /**
     * Asynchronously refreshes the configuration when a request has bee done (filechange, restart, etc)
     * This will check if Apache is running, get the config files, and send an event when everything is done
     */
    var _requestConfigurationRefresh = function()
    {
        app.logActivity(app.locale.apache.check);
        app.node.exec('apachectl -t', function(error, stdout, stderr)
        {
            _checkAvailableModules();
        });
    };

    /**
     * Gets the list of available modules
     */
    var _checkAvailableModules = function()
    {
        app.node.exec('ls ' + modulesPath, function(error, stdout, stderr) // @todo handle errors & refactors (promises ?)
        {
            _checkEnabledModules(stdout);
        });
    };

    /**
     * Gets the list of enabled modules
     * @param available_modules
     */
    var _checkEnabledModules = function(available_modules)
    {
        app.node.exec('cat ' + confPath, function(error, stdout, stderr) // @todo handle errors & refactors
        {
            var enabled_modules = [];
            app.utils.regexp.search(/[^#]?LoadModule\s(.*)_module.*\.so/gi, stdout, function(match)
            {
                enabled_modules.push(match);
            });
            var modules = [];
            app.utils.regexp.search(/mod_([^.]*)\.so/g, available_modules, function(match)
            {
                modules.push({name: match, filename: match + '.so', enabled: enabled_modules.indexOf(match) !== -1});
            });
            _emitConfiguration(modules);
        });
    };

    /**
     * Checks the status and emits the server configuration to the app
     * @param modules
     */
    var _emitConfiguration = function(modules)
    {
        app.utils.shell.isProcessRunning('/usr/sbin/httpd', function(is_running)
        {
            app.logActivity(app.locale.apache[is_running ? 'running' : 'stopped']);
            events.emit('idle', is_running, modules);
        });
    };

    app.utils.apache = module;

})(window.App);