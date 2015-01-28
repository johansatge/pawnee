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
        app.node.exec('cat ' + app.models.apache.confPath, function(error, stdout, stderr)
        {
            app.logActivity(stderr);
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
            _searchRegex(/[^#]?LoadModule\s(.*)_module.*\.so/gi, stdout, function(match)
            {
                enabled_modules.push(match);
            });
            var modules = [];
            _searchRegex(/mod_([^.]*)\.so/g, available_modules, function(match)
            {
                modules.push({name: match, filename: match + '.so', enabled: enabled_modules.indexOf(match) !== -1});
            });
            callback(modules);
        });
    };

    /**
     * Searches for the regex in the given subject
     * Triggers the callback for each match and sends the first capturing group
     * @param regexp
     * @param subject
     * @param callback
     */
    var _searchRegex = function(regexp, subject, callback)
    {
        var match;
        do
        {
            match = regexp.exec(subject);
            if (match !== null)
            {
                callback(match[1]);
            }
        }
        while (match);
    };

    app.utils.apache.module = module;

})(window.App);