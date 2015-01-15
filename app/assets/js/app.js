/**
 * App bootstrap
 */
(function(window, $, require, process)
{

    'use strict';

    var app = {};
    app.node = {};
    app.node.gui = require('nw.gui');
    app.node.fs = require('fs');
    app.node.events = require('events');
    app.node.watcher = require('chokidar');
    app.node.util = require('util');
    app.node.exec = require('child_process').exec;
    app.models = {};
    app.views = {};
    app.controllers = {};
    app.utils = {};
    app.devMode = app.node.fs.existsSync('.dev') && app.node.fs.readFileSync('.dev', {encoding: 'utf8'}) === '1';

    /**
     * Inits
     */
    app.init = function()
    {
        app.controllers.panel.on('loaded', $.proxy(_onPanelReady, this));
        app.controllers.panel.load();
    };

    /**
     * Readable console.log
     * @param thing
     */
    app.log = function(thing)
    {
        process.stdout.write(app.node.util.inspect(thing));
    };

    /**
     * Starts working when the panel is ready
     */
    var _onPanelReady = function()
    {
        _initTray();
        _initMenu();
    };

    /**
     * Creates the tray icon
     */
    var _initTray = function()
    {
        var tray = new app.node.gui.Tray({
            title: '',
            icon: 'assets/css/images/menu_icon.png',
            alticon: 'assets/css/images/menu_alticon.png'
        });
        tray.on('click', $.proxy(_onTrayClick, this));
    };

    /**
     * Inits app menu
     * @todo remove unused items
     */
    var _initMenu = function()
    {
        var menubar = new app.node.gui.Menu({type: 'menubar'});
        menubar.createMacBuiltin('');
        app.node.gui.Window.get().menu = menubar;
    };

    /**
     * Clicks on the tray icon
     * @param evt
     */
    var _onTrayClick = function(evt)
    {
        app.controllers.panel.toggle(evt.x, evt.y);
    };

    window.App = app;

})(window, jQuery, require, process);