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
            var versions = [
                {name: '--', value: '', current: true}
            ];
            app.utils.regex.search(/php([0-9])([0-9])$/gm, stdout, function(match)
            {
                versions.push({name: match[1] + '.' + match[2], value: match[0], current: false});
            });
            callback(versions);
        });
    };

    /**
     * Gets the current PHP version
     */
    var _getCurrentVersion = function()
    {

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