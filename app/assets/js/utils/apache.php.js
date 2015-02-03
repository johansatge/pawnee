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
        app.log('@todo php version: ' + version);
        callback(version);
        // @todo read httpd, remove existing module if needed, adds new one, unlinks brew packages, link right one, triggers the callback
    };

    /**
     * Gets available PHP versions
     * @param callback
     */
    module.getVersions = function(callback)
    {
        app.node.exec('brew list', function(error, stdout, stderr)
        {
            app.logActivity(stderr);
            app.utils.apache.conf.getConfiguration(function(error, httpd, stderr)
            {
                var curr_version_match = new RegExp(/(php[0-9]{2})[^.]+.so/g).exec(httpd);
                var curr_version = curr_version_match !== null && typeof curr_version_match[1] !== 'undefined' ? curr_version_match[1] : '';
                var versions = [];
                versions.push({name: '--', value: '', current: true});
                app.utils.regex.search(/php([0-9])([0-9])$/gm, stdout, function(match)
                {
                    versions.push({name: match[1] + '.' + match[2], value: match[0], current: curr_version === match[0]});
                });
                callback(versions);
            });
        });
    };

    /**
     * Gets available PHP Brew packages
     * @param callback
     */
    module.getPackages = function(callback)
    {
        app.node.exec('brew search | grep php', function(error, availabe_packages, stderr)
        {
            app.logActivity(stderr);
            app.node.exec('brew list | grep php', function(error, stdout, stderr)
            {
                app.logActivity(stderr);
                var installed_packages = stdout.split('\n');
                var packages = [];
                app.utils.regex.search(/^php.*/gm, availabe_packages, function(match)
                {
                    packages.push({name: match[0], value: match[0], installed: installed_packages.indexOf(match[0]) !== -1});
                });
                callback(packages);
            });
        });
    };

    var _getLinkedPackages = function()
    {
        app.node.exec('ls -l /usr/local/Library/LinkedKegs | awk -F\\  "{print $9}"', function(error, stdout, stderr)
        {
            //app.log(stderr);
            //app.log(stdout);
        });
    };

    app.utils.apache.php = module;

})(window.App);