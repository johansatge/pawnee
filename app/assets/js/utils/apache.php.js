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
        // @todo
        callback([]);
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