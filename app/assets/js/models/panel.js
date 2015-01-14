/**
 * Panel model
 */
(function(app)
{

    'use strict';

    var module = function()
    {

        this.getServerStatus = function()
        {
            return false;
        };

    };

    app.models.panel = module;

})(window.App);