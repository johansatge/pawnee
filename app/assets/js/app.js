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

    var panel;

    /**
     * Inits
     */
    app.init = function()
    {
        panel = new app.controllers.panel();
        panel.on('loaded', $.proxy(_onPanelReady, this));
        panel.init();
    };

    /**
     * Disables drag&drop
     * @param $body
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

    /**
     * Creates the tray icon when the panel view is ready
     */
    var _onPanelReady = function()
    {
        var tray = new app.node.gui.Tray({
            title: '',
            icon: 'assets/css/images/menu_icon.png',
            alticon: 'assets/css/images/menu_alticon.png'
        });
        tray.on('click', $.proxy(_onTrayClick, this));
    };

    /**
     * Clicks on the tray icon
     * @param evt
     */
    var _onTrayClick = function(evt)
    {
        panel.toggle(evt.x, evt.y);
    };

    window.App = app;

})(window, jQuery, require);