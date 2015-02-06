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
    app.node.crypto = require('crypto');
    app.node.os = require('os');
    app.models = {};
    app.views = {};
    app.views.panel = {};
    app.controllers = {};
    app.utils = {};
    app.utils.apache = {};
    app.devMode = app.node.fs.existsSync('.dev') && app.node.fs.readFileSync('.dev', {encoding: 'utf8'}) === '1';
    app.locale = eval('(' + app.node.fs.readFileSync('locale/en.json') + ')');

    var panel;
    var tray;

    /**
     * Inits (moves the default window to 0 - 0 for later UI positionning, and asks for sudo privileges)
     */
    app.init = function()
    {
        app.node.gui.Window.get().moveTo(0, 0);
        _askSudo();
    };

    /**
     * Readable console.log
     * @param thing
     */
    app.log = function(thing)
    {
        var output = typeof thing === 'string' ? thing : app.node.util.inspect(thing);
        process.stdout.write("\n" + output + "\n");
    };

    /**
     * Logs activity
     * @param message
     */
    app.logActivity = function(message)
    {
        if (message.search(/[^ \n]/g) !== -1)
        {
            panel.logActivity(message);
        }
    };

    /**
     * Quits the app
     */
    app.quit = function()
    {
        app.node.gui.App.quit();
    };

    /**
     * Ask for the required sudo credentials
     * @private
     */
    var _askSudo = function()
    {
        app.utils.sudo.on('answer', $.proxy(_onSudoAnswer, this));
        app.utils.sudo.ask();
    };

    /**
     * Triggered when the user has filled the sudo input
     * Possible answers are: "success", "fail", "cancel"
     * @param answer
     */
    var _onSudoAnswer = function(answer)
    {
        var callbacks = {'cancel': app.quit, 'fail': app.utils.sudo.ask, 'default': _initPanel};
        (callbacks[answer] ? callbacks[answer] : callbacks['default'])();
    };

    /**
     * Inits the panel
     */
    var _initPanel = function()
    {
        panel = new app.controllers.panel();
        panel.on('loaded', $.proxy(_onPanelReady, this));
        panel.load();
    };

    /**
     * Inits the tray icon and make UI available when the panel is ready
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
        tray = new app.node.gui.Tray({
            title: '',
            icon: 'assets/css/images/menu_icon.png',
            alticon: 'assets/css/images/menu_alticon.png',
            iconsAreTemplates: false
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
        panel.toggle(evt.x, evt.y);
    };

    window.App = app;

})(window, jQuery, require, process);