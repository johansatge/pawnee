/**
 * Apache utils
 * @todo handle errors when doing shell scripts
 */
(function(app, $)
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
    module.startstop = function()
    {
        events.emit('working');
        app.utils.shell.isProcessRunning('httpd', function(is_running)
        {
            (is_running ? _stopServer : _startServer)();
        });
    };

    /**
     * Restarts the server
     */
    module.restart = function()
    {
        events.emit('working');
        _restartServer();
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
        app.utils.shell.exec('cat ' + confPath).then(function(stdout, stderr) // @todo backup httpd.conf & handle errors
        {
            var added_httpd = 'LoadModule ' + module + '_module ' + relativeModulesPath + 'mod_' + module + '.so' + "\n" + stdout;
            var removed_httpd = stdout.replace(new RegExp('LoadModule\\s' + module + '_module\\s.*?\\.so\n', 'gi'), '');
            app.utils.shell.exec('sudo cat << "EOF" > ' + confPath + "\n" + (enable ? added_httpd : removed_httpd) + 'EOF').then(function(stdout, stderr) // @todo handle errors
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
        app.utils.shell.isProcessRunning('httpd', function(is_running)
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
        app.utils.shell.isProcessRunning('httpd', function(is_running)
        {
            app.logActivity(app.locale.apache.check);
            app.utils.shell.exec('apachectl -t').then(function(stdout, stderr) // @todo handle errors
            {
                app.logActivity(app.locale.apache[is_running ? 'running' : 'stopped']);
                app.utils.shell.exec('ls ' + modulesPath).then(function(stdout, stderr) // @todo handle errors & refactors (promises ?)
                {
                    var list = stdout;
                    app.utils.shell.exec('cat ' + confPath).then(function(stdout, stderr) // @todo handle errors & refactors
                    {
                        var httpd = stdout;
                        var enabled_modules = [];
                        app.utils.regexp.search(/[^#]?LoadModule\s(.*)_module.*\.so/gi, httpd, function(match)
                        {
                            enabled_modules.push(match);
                        });
                        var modules = [];
                        app.utils.regexp.search(/mod_([^.]*)\.so/g, list, function(match)
                        {
                            modules.push({name: match, filename: match + '.so', enabled: enabled_modules.indexOf(match) !== -1});
                        });
                        events.emit('idle', is_running, modules);
                    });
                });
            });
        });
    };

    /**
     * Starts the server
     */
    var _startServer = function()
    {
        app.logActivity(app.locale.apache.start);
        app.utils.shell.exec('sudo apachectl start').then(_requestConfigurationRefresh);
    };

    /**
     * Stops the server
     */
    var _stopServer = function()
    {
        app.logActivity(app.locale.apache.stop);
        app.utils.shell.exec('sudo apachectl stop').then(_requestConfigurationRefresh);
    };

    /**
     * Restarts the server
     */
    var _restartServer = function()
    {
        app.logActivity(app.locale.apache.restart);
        app.utils.shell.exec('sudo apachectl restart').then(_requestConfigurationRefresh);
    }

    app.utils.apache = module;

})(window.App, jQuery);