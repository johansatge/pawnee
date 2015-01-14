/**
 * Templates manager
 */
(function(app)
{

    'use strict';

    var module = {};

    /**
     * Parses and returns a template
     * @param template
     * @param data
     * @return string
     */
    module.render = function(template, data)
    {
        for(var property in data)
        {
            var regexp = new RegExp('{{' + property + '}}', 'g');
            template = template.replace(regexp, data[property]);
        }
        return template;
    };

    app.utils.template = module;

})(window.App);