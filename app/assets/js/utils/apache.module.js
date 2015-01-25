/**
 * Apache modules
 * @todo backup httpd.conf before editing
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
        app.node.exec('cat ' + app.models.apache.confPath, function(error, stdout, stderr)
        {
            app.logActivity(stderr);
            var added_httpd = 'LoadModule ' + module + '_module ' + app.models.apache.relativeModulesPath + 'mod_' + module + '.so' + "\n" + stdout;
            var removed_httpd = stdout.replace(new RegExp('LoadModule\\s' + module + '_module\\s.*?\\.so\n', 'gi'), '');
            app.node.exec('sudo cat << "EOF" > ' + app.models.apache.confPath + "\n" + (enable ? added_httpd : removed_httpd) + 'EOF', function(error, stdout, stderr)
            {
                app.logActivity(stderr);
            });
        });
    };

    /**
     * Gets the list of modules with their state
     * @param callback
     */
    module.get = function(callback)
    {
        app.node.exec('ls ' + app.models.apache.modulesPath, function(error, stdout, stderr)
        {
            app.logActivity(stderr);
            _checkEnabledModules(stdout, callback);
        });
    };

    /**
     * Gets the list of enabled modules
     * @param available_modules
     * @param callback
     */
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
    };

    app.utils.apache.module = module;

})(window.App);