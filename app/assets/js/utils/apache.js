/**
 * Apache utils
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
        app.node.exec('ps aux', function(error, stdout, stderr)
        {
            var std = stdout + stderr;
            if (std.search(/\/httpd/) !== -1)
            {
                app.logActivity(app.locale.apache.stop);
                app.node.exec('sudo apachectl stop', function(error, stdout, stderr)
                {
                    app.logActivity(stdout + stderr);
                    _refreshConfiguration();
                });
            }
            else
            {
                app.logActivity(app.locale.apache.start);
                app.node.exec('sudo apachectl start', function(error, stdout, stderr)
                {
                    app.logActivity(stdout + stderr);
                    _refreshConfiguration();
                });
            }
        });
    };

    /**
     * Restarts the server
     */
    module.restart = function()
    {
        events.emit('working');
        app.logActivity(app.locale.apache.restart);
        app.node.exec('sudo apachectl restart', function(error, stdout, stderr)
        {
            app.logActivity(stdout + stderr);
            _refreshConfiguration();
        });
    };

    /**
     * Toggles the state of a module
     * The watcher will automatically restart the server on file change
     * @todo backup httpd.conf
     * @param module
     * @param enable
     */
    module.toggleModule = function(module, enable)
    {
        app.logActivity(app.locale.apache[enable ? 'enable_module' : 'disable_module'].replace('%s', module));
        events.emit('working');
        var httpd = app.node.fs.readFileSync(confPath, {encoding: 'utf8'});
        if (enable)
        {
            var newline = 'LoadModule ' + module + '_module ' + relativeModulesPath + 'mod_' + module + '.so' + "\n";
            var updated_httpd = newline + httpd;
        }
        else
        {
            var regexp = new RegExp('LoadModule\\s' + module + '_module\\s.*?\\.so\n', 'gi');
            var updated_httpd = httpd.replace(regexp, '');
        }
        var updated_httpd_path = tempPath + new Date().getTime() + '.httpd.conf';
        app.node.fs.writeFileSync(updated_httpd_path, updated_httpd);
        app.node.exec('sudo rm ' + confPath + ' && sudo mv ' + updated_httpd_path + ' ' + confPath, function(error, stdout, stderr)
        {
            app.logActivity(stdout + stderr);
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
     * Gets the modules list
     * @todo refactor & log activity
     */
    var _getModules = function()
    {
        var httpd = app.node.fs.readFileSync(confPath, {encoding: 'utf8'});
        var regexp = /[^#]?LoadModule\s(.*)_module.*\.so/gi;
        var enabled_modules = [];
        var match;
        while (match = regexp.exec(httpd))
        {
            enabled_modules.push(match[1]);
        }
        var files = app.node.fs.readdirSync(modulesPath);
        var modules = [];
        for (var index = 0; index < files.length; index += 1)
        {
            var filename = files[index];
            var match = new RegExp(/^mod_([^.]*)\.so$/).exec(filename);
            if (match !== null && typeof match[1] !== 'undefined')
            {
                modules.push({
                    name: match[1],
                    filename: filename,
                    enabled: enabled_modules.indexOf(match[1]) !== -1
                });
            }
        }
        return modules;
    };

    /**
     * Restarts the server when a config file changes (if already running)
     */
    var _onFileChange = function()
    {
        events.emit('working');
        app.node.exec('ps aux', function(error, stdout, stderr)
        {
            var std = stdout + stderr;
            if (std.search(/\/httpd/) !== -1)
            {
                module.restart();
            }
            else
            {
                _refreshConfiguration();
            }
        });
    };

    /**
     * Asynchronously refreshes the configuration when a request has bee done (filechange, restart, etc)
     * This will check if Apache is running, get the config files, and send an event when everything is done
     */
    var _refreshConfiguration = function()
    {
        app.node.exec('ps aux', function(error, stdout, stderr)
        {
            var std = stdout + stderr;
            var is_running = std.search(/\/httpd/) !== -1;
            var modules = _getModules();
            events.emit('idle', is_running, modules);
        });
    };

    app.utils.apache = module;

})(window.App, jQuery);