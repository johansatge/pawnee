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
     * @todo close watcher when closing app - watcher.close()
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
     * @todo
     * @param module
     * @param enable
     */
    module.toggleModule = function(module, enable)
    {
        events.emit('working');



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
        app.node.exec('apachectl -t -D DUMP_MODULES', function(error, stdout, stderr)
        {
            var enabled_modules = [];
            var regexp = /([a-zA-Z0-9_-]+) \([a-z]+\)/gm;
            while (match = regexp.exec(stdout))
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
                    modules.push({name: match[1], enabled: enabled_modules.indexOf(match[1] + '_module') !== -1});
                }
            }
            events.emit('idle', modules);
        });
    };

    app.utils.apache = module;

})(window.App, jQuery);