/**
 * Regex utils
 */
(function(app)
{

    'use strict';

    var module = {};

    /**
     * Searches for the regexp in the given subject
     * Triggers the callback for each match and sends the first capturing group
     * @param regexp
     * @param subject
     * @param callback
     */
    module.search = function(regexp, subject, callback)
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
        while(match);
    };

    app.utils.regexp = module;

})(window.App);