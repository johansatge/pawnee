/**
 * Apache utils
 */
(function(app)
{

    'use strict';

    var module = {};

    module.confPath = '/etc/apache2/httpd.conf';
    module.modulesPath = '/usr/libexec/apache2/';

    /**
     * Returns the list of available modules
     * @return object
     */
    module.getAvailableModules = function()
    {
        var files = app.node.fs.readdirSync(module.modulesPath);
        var modules = [];
        for(var index = 0; index < files.length; index += 1)
        {
            var filename = files[index];
            var match = new RegExp(/^mod_([^.]*)\.so$/).exec(filename);
            if (match !== null && typeof match[1] !== 'undefined')
            {
                modules.push({name: 'module_' + match[1]});
            }
        }
        return modules;
    };

    app.utils.apache = module;

})(window.App);