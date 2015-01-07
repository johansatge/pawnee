/**
 * App bootstrap
 */
(function(window, $, require)
{

    'use strict';

    var app = {};
    app.node = {};
    app.node.gui = require('nw.gui');
    app.node.fs = require('fs');
    app.node.events = require('events');
    app.models = {};
    app.views = {};
    app.controllers = {};
    app.devMode = app.node.fs.existsSync('.dev') && app.node.fs.readFileSync('.dev', {encoding: 'utf8'}) === '1';
    app.menubar = false;

    /**
     * Inits
     */
    app.init = function()
    {
        var panel = new app.controllers.panel();
        panel.init();
    };

    /**
     * Disables drag&drop
     * @param document
     */
    app.disableDragDrop = function($body)
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

    window.App = app;

})(window, jQuery, require);