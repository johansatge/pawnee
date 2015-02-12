/**
 * PHP manager
 */
(function(app)
{

    'use strict';

    var module = {};

    /**
     * Sets the current PHP version
     * @param version
     * @param callback
     */
    module.setVersion = function(version, callback)
    {
        app.logActivity(app.locale.apache.set_php_version.replace('%s', version));
        app.utils.apache.conf.getConfiguration(function(httpd)
        {
            var current_module = new RegExp(/(LoadModule php5_module[^;\n]+)/gi).exec(httpd);
            if (current_module !== null && typeof current_module[1] !== 'undefined')
            {
                httpd = httpd.replace(current_module[1], '');
            }
            httpd = app.models.apache.phpModuleDirective.replace('%s', version) + '\n' + httpd;
            app.node.exec('for version in $(brew list | grep "php"); do brew unlink $version; done', function(error, stdout, stderr)
            {
                app.logActivity(stdout + stderr);
                app.node.exec(app.models.apache.brewPath + ' link ' + version, function(error, stdout, stderr)
                {
                    app.logActivity(stdout + stderr);
                    app.utils.apache.conf.updateConfiguration(httpd, callback);
                });
            });
        });
    };

    /**
     * Gets available PHP versions
     * @param callback
     */
    module.getVersions = function(callback)
    {
        app.node.exec(app.models.apache.brewPath + ' list', function(error, stdout, stderr)
        {
            app.logActivity(stderr);
            app.utils.apache.conf.getConfiguration(function(httpd)
            {
                var curr_version_match = new RegExp(/(php[0-9]{2})[^.]+.so/g).exec(httpd);
                var curr_version = curr_version_match !== null && typeof curr_version_match[1] !== 'undefined' ? curr_version_match[1] : '';
                var versions = [];
                versions.push({name: '--', value: '', current: true});
                app.utils.regex.search(/php([0-9])([0-9])$/gm, stdout, function(match)
                {
                    versions.push({name: match[1] + '.' + match[2], value: match[0], current: curr_version === match[0]});
                });
                callback({php_versions: versions});
            });
        });
    };

    /**
     * Gets available PHP Brew packages
     * @param callback
     */
    module.getPackages = function(callback)
    {
        app.node.exec(app.models.apache.brewPath + ' search | grep php', function(error, availabe_packages, stderr)
        {
            app.logActivity(stderr);
            app.node.exec(app.models.apache.brewPath + ' list | grep php', function(error, stdout, stderr)
            {
                app.logActivity(stderr);
                var installed_packages = stdout.split('\n');
                var packages = [];
                app.utils.regex.search(/^php.*/gm, availabe_packages, function(match)
                {
                    packages.push({name: match[0], value: match[0], installed: installed_packages.indexOf(match[0]) !== -1});
                });
                callback({php_packages: packages});
            });
        });
    };

    /**
     * Shows the informations of a package
     * @param package_name
     */
    module.showPackageInfo = function(package_name)
    {
        app.node.exec(app.models.apache.brewPath + ' info ' + package_name, function(error, stdout, stderr)
        {
            var formula_url = new RegExp(/From: ?(http.*)$/gm).exec(stdout);
            var website_url = new RegExp(/^http.*$/gm).exec(stdout);
            if (formula_url !== null && typeof formula_url[1] !== 'undefined')
            {
                app.node.gui.Shell.openExternal(formula_url[1]);
            }
            if (website_url !== null && typeof website_url[0] !== 'undefined')
            {
                app.node.gui.Shell.openExternal(website_url[0]);
            }
        });
    };

    app.utils.apache.php = module;

})(window.App);