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
    var tempPath = '/private/tmp/';

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
     * @todo backup httpd.conf & refactor
     * @param module
     * @param enable
     */
    module.toggleModule = function(module, enable)
    {
        events.emit('working');
        app.logActivity(app.locale.apache[enable ? 'enable_module' : 'disable_module'].replace('%s', module));
        var httpd = app.node.fs.readFileSync(confPath, {encoding: 'utf8'}); // @todo check if file exists
        var updated_httpd;
        if (enable)
        {
            updated_httpd = 'LoadModule ' + module + '_module ' + relativeModulesPath + 'mod_' + module + '.so' + "\n" + httpd;
        }
        else
        {
            updated_httpd = httpd.replace(new RegExp('LoadModule\\s' + module + '_module\\s.*?\\.so\n', 'gi'), '');
        }
        var updated_httpd_path = tempPath + new Date().getTime() + '.httpd.conf';
        app.node.fs.writeFileSync(updated_httpd_path, updated_httpd);
        app.utils.shell.exec('sudo rm ' + confPath + ' && sudo mv ' + updated_httpd_path + ' ' + confPath);
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
     * Gets the modules list
     */
    var _getModules = function()
    {
        var enabled_modules = _getEnabledModules();
        var files = app.node.fs.readdirSync(modulesPath); // @todo check if dir exists
        var modules = [];
        for (var index = 0; index < files.length; index += 1)
        {
            var filename = files[index];
            var match = new RegExp(/^mod_([^.]*)\.so$/).exec(filename);
            if (match !== null && typeof match[1] !== 'undefined')
            {
                modules.push({name: match[1], filename: filename, enabled: enabled_modules.indexOf(match[1]) !== -1});
            }
        }
        return modules;
    };

    /**
     * Gets the enabled modules (by reading the httpd.conf file)
     * @return array
     */
    var _getEnabledModules = function()
    {
        var httpd = app.node.fs.readFileSync(confPath, {encoding: 'utf8'}); // @todo check if dir exists & refactor (multiple calls)
        var regexp = /[^#]?LoadModule\s(.*)_module.*\.so/gi;
        var enabled_modules = [];
        var match;
        while (match = regexp.exec(httpd))
        {
            enabled_modules.push(match[1]);
        }
        return enabled_modules;
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
            app.utils.shell.exec('apachectl -t', function()
            {
                app.logActivity(app.locale.apache[is_running ? 'running' : 'stopped']);
                events.emit('idle', is_running, _getModules());
            });
        });
    };

    /**
     * Starts the server
     */
    var _startServer = function()
    {
        app.logActivity(app.locale.apache.start);
        app.utils.shell.exec('sudo apachectl start', $.proxy(_requestConfigurationRefresh, this));
    };

    /**
     * Stops the server
     */
    var _stopServer = function()
    {
        app.logActivity(app.locale.apache.stop);
        app.utils.shell.exec('sudo apachectl stop', $.proxy(_requestConfigurationRefresh, this));
    };

    /**
     * Restarts the server
     */
    var _restartServer = function()
    {
        app.logActivity(app.locale.apache.restart);
        app.utils.shell.exec('sudo apachectl restart', $.proxy(_requestConfigurationRefresh, this));
    }

    app.utils.apache = module;

})(window.App, jQuery);