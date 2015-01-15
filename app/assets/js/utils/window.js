/**
 * Window utils
 */
(function(app)
{

    'use strict';

    var module = {};

    /**
     * Disables drag&drop
     * @param $body
     */
    module.disableDragDrop = function($body)
    {
        $body.on('dragover', function(evt)
        {
            evt.preventDefault();
            evt.stopPropagation();
        });
        $body.on('drop', function(evt)
        {
            evt.preventDefault();
            evt.stopPropagation();
        });
    };

    app.utils.window = module;

})(window.App);