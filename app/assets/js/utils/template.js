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
     * @param clean_markers
     * @return string
     */
    module.render = function(template, data, clean_markers)
    {
        for (var index = 0; index < data.length; index += 1)
        {
            if (typeof data[index] === 'object')
            {
                for (var property in data[index])
                {
                    var regex = new RegExp('{{' + property + '}}', 'g');
                    template = template.replace(regex, data[index][property]);
                }
            }
        }
        return clean_markers ? template.replace(/\{\{[\w_]+\}\}/g, '') : template;
    };

    app.utils.template = module;

})(window.App);