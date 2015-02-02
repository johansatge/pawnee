/**
 * Regex utils
 */
(function(app)
{

    'use strict';

    var module = {};

    /**
     * Searches for the regex in the given subject
     * Triggers the callback for each match and sends the first capturing group
     * @param regex
     * @param subject
     * @param callback
     */
    module.search = function(regex, subject, callback)
    {
        var match;
        do
        {
            match = regex.exec(subject);
            if (match !== null)
            {
                callback(match);
            }
        }
        while (match);
    };

    app.utils.regex = module;

})(window.App);