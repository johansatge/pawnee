/**
 * Window utils
 */
(function(app, $)
{

    'use strict';

    var module = {};

    /**
     * Disables drag&drop
     * @param document
     */
    module.disableDragDrop = function(document)
    {
        var $document = $(document);
        $document.on('dragover', function(evt)
        {
            evt.preventDefault();
            evt.stopPropagation();
        });
        $document.on('drop', function(evt)
        {
            evt.preventDefault();
            evt.stopPropagation();
        });
    };

    app.utils.window = module;

})(window.App, jQuery);