/**
 * Apache virtual hosts
 * @todo backup httpd.conf before editing
 */
(function(app)
{

    'use strict';

    var module = {};

    /**
     * Gets the list of vhosts
     * @param callback
     */
    module.get = function(callback)
    {
        app.node.exec('cat ' + app.models.apache.confPath, function(error, stdout, stderr)
        {
            app.logActivity(stderr);


            var lines = stdout.split('\n');
            var raw_vhosts = [];
            var current_vhost = false;
            for(var index = 0; index < lines.length; index += 1)
            {
                if (lines[index].search(/ *?<VirtualHost/i) !== -1)
                {
                    current_vhost = raw_vhosts.length;
                    raw_vhosts[current_vhost] = '';
                }
                if (current_vhost !== false)
                {
                    raw_vhosts[current_vhost] += lines[index] + '\n';
                }
                if (lines[index].search(/ *?<\/VirtualHost>/i) !== -1)
                {
                    current_vhost = false;
                }
            }

            app.log(raw_vhosts);


            // @todo
            // /DocumentRoot[ "]+([^"]+)"/i
            // /ServerName[ "]+([^"]+)"/i
            // /<VirtualHost +([^:]+):([^>]+)>/i



            callback([{name: '@todo list'}]);
        });
    };

    /**
     * Gets the list of enabled modules
     * @param available_modules
     * @param callback
     *
    var _checkEnabledModules = function(available_modules, callback)
    {
        app.node.exec('cat ' + app.models.apache.confPath, function(error, stdout, stderr)
        {
            app.logActivity(stderr);
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
            callback(modules);
        });
    };*/

    app.utils.apache.virtualhost = module;

})(window.App);