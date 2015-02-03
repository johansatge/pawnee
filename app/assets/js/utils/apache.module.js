/**
 * Apache modules
 */
(function(app)
{

    'use strict';

    var module = {};

    /**
     * Toggles the state of a module
     * The watcher will automatically restart the server on file change
     * @param module
     * @param enable
     */
    module.toggleState = function(module, enable)
    {
        app.logActivity(app.locale.apache[enable ? 'enable_module' : 'disable_module'].replace('%s', module));
        app.utils.apache.conf.getConfiguration(function(stdout)
        {
            var updated_httpd;
            if (enable)
            {
                updated_httpd = 'LoadModule ' + module + '_module ' + app.models.apache.relativeModulesPath + 'mod_' + module + '.so' + "\n" + stdout;
            }
            else
            {
                updated_httpd = stdout.replace(new RegExp('LoadModule\\s' + module + '_module\\s.*?\\.so\n', 'gi'), '');
            }
            app.utils.apache.conf.updateConfiguration(updated_httpd);
        });
    };

    /**
     * Gets the list of modules and their state
     * @param callback
     */
    module.get = function(callback)
    {
        app.node.exec('ls ' + app.models.apache.modulesPath, function(error, available_modules, stderr)
        {
            app.logActivity(stderr);
            app.utils.apache.conf.getConfiguration(function(stdout)
            {
                var enabled_modules = [];
                app.utils.regex.search(/[^#]?LoadModule\s(.*)_module.*\.so/gi, stdout, function(match)
                {
                    enabled_modules.push(match[1]);
                });
                var modules = [];
                app.utils.regex.search(/mod_([^.]*)\.so/g, available_modules, function(match)
                {
                    modules.push({name: match[1], filename: match[1] + '.so', enabled: enabled_modules.indexOf(match[1]) !== -1});
                });
                callback(modules);
            });
        });
    };

    app.utils.apache.module = module;

})(window.App);