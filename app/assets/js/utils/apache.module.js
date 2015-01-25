/**
 * Apache modules
 */
(function(app)
{

    'use strict';

    var module = {};

    var confPath = '/etc/apache2/httpd.conf';
    var modulesPath = '/usr/libexec/apache2/';
    var relativeModulesPath = 'libexec/apache2/';

    /**
     * Toggles the state of a module
     * The watcher will automatically restart the server on file change
     * @param module
     * @param enable
     */
    module.toggle = function(module, enable)
    {
        app.logActivity(app.locale.apache[enable ? 'enable_module' : 'disable_module'].replace('%s', module));
        app.node.exec('cat ' + confPath, function(error, stdout, stderr) // @todo backup httpd.conf & handle errors
        {
            var added_httpd = 'LoadModule ' + module + '_module ' + relativeModulesPath + 'mod_' + module + '.so' + "\n" + stdout;
            var removed_httpd = stdout.replace(new RegExp('LoadModule\\s' + module + '_module\\s.*?\\.so\n', 'gi'), '');
            app.node.exec('sudo cat << "EOF" > ' + confPath + "\n" + (enable ? added_httpd : removed_httpd) + 'EOF', function(error, stdout, stderr) // @todo handle errors
            {

            });
        });
    };

    /**
     * Gets the list of modules with their state
     * @param callback
     */
    module.get = function(callback)
    {
        app.node.exec('ls ' + modulesPath, function(error, stdout, stderr) // @todo handle errors & refactors (promises ?)
        {
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
        app.node.exec('cat ' + confPath, function(error, stdout, stderr) // @todo handle errors & refactors
        {
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