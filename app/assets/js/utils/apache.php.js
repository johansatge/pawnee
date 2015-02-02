/**
 * PHP manager
 */
(function(app)
{

    'use strict';

    var module = {};

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
        // @todo
        callback([]);
    };

    app.utils.apache.php = module;

})(window.App);