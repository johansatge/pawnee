/**
 * Apache watcher
 */
(function(app)
{

    'use strict';

    var module = function()
    {

        var events = new app.node.events.EventEmitter();
        var confPath = '/etc/apache2/httpd.conf';
        var modulesPath = '/usr/libexec/apache2/';

        /**
         * Attaches an event
         * @param event
         * @param callback
         */
        this.on = function(event, callback)
        {
            events.on(event, callback);
        };

        /**
         * Starts watching the needed apache files
         */
        this.watch = function()
        {
            var watcher = app.node.watcher.watch(confPath, {persistent: true});
            watcher.add(modulesPath);
            watcher.on('change', _onFileChange);
            watcher.on('ready', _onFileChange);
            app.logActivity(app.locale.apache.watch.replace('%s', confPath));
            app.logActivity(app.locale.apache.watch.replace('%s', modulesPath));
        };

        /**
         * Triggers when a configuration file is update
         * @private
         */
        var _onFileChange = function()
        {
            app.logActivity(app.locale.apache.filechange);
            events.emit('change');
        }

    };

    app.utils.apache.watcher = module;

})(window.App);