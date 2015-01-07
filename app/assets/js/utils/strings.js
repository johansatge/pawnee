/**
 * Static strings
 */
(function(app)
{

    'use strict';

    var module = {};
    var data = null;

    /**
     * Inits
     */
    var init = function()
    {
        data = eval('(' + app.node.fs.readFileSync('strings/strings.json', 'utf-8') + ')');
    };

    /**
     * Gets a locale
     * @param name
     */
    module.get = function(name)
    {
        return typeof data[name] !== 'undefined' ? data[name] : {};
    };

    /**
     * Gets a status code
     * @param status_code
     */
    module.getStatusCode = function(status_code)
    {
        var readable_codes = module.get('status');
        return typeof readable_codes[status_code] !== 'undefined' ? status_code + ' ' + readable_codes[status_code] : status_code;
    };

    init();
    app.utils.strings = module;

})(window.App);