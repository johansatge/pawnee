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
     * Starts watching files
     */
    module.watch = function()
    {
        var watcher = app.node.watcher.watch(confPath, {persistent: true});
        watcher.add(modulesPath);
        watcher.on('change', $.proxy(_onFileChange, this));
        watcher.on('ready', $.proxy(_onFileChange, this));
    };

    /**
     * Toggles the state of a module
     * @param module
     * @param enable
     */
    module.toggleModule = function(module, enable)
    {
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
            // @todo handle errors
            // file change is handled by the main watcher
        });
    };

    /**
     * Triggered when a config file changes
     */
    var _onFileChange = function()
    {
        events.emit('working');
        _refreshModules();
    };

    /**
     * Gets the modules list
     * @todo refactor
     */
    var _refreshModules = function()
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
        events.emit('idle', modules);
    };

    app.utils.apache = module;

})(window.App, jQuery);