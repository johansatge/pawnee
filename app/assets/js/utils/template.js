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
        for(var index = 0; index < data.length; index += 1)
        {
            for(var property in data[index])
            {
                var regexp = new RegExp('{{' + property + '}}', 'g');
                template = template.replace(regexp, data[index][property]);
            }
        }
        return template;
    };

    app.utils.template = module;

})(window.App);