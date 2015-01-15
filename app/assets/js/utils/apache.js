/**
 * Apache utils
 */
(function(app)
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
     * Triggered when a config file changes
     * @todo refactor
     */
    var _onFileChange = function()
    {
        events.emit('load_config');
        var files = app.node.fs.readdirSync(modulesPath);
        var modules = [];
        for (var index = 0; index < files.length; index += 1)
        {
            var filename = files[index];
            var match = new RegExp(/^mod_([^.]*)\.so$/).exec(filename);
            if (match !== null && typeof match[1] !== 'undefined')
            {
                modules.push({name: 'module_' + match[1]});
            }
        }
        app.node.exec('apachectl -t -D DUMP_MODULES', function(error, stdout, stderr)
        {
            app.log('stdout: ' + stdout);
            app.log('stderr: ' + stderr);
            if (error !== null)
            {
                app.log('exec error: ' + error);
            }
            events.emit('loaded_config', modules);
        });
    };

    app.utils.apache = module;

})(window.App);