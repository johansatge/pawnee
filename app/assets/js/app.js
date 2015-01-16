/**
 * App bootstrap
 * @todo check if:
 *  * config files exist
 *  * cli commands exist
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

    var panel;

    /**
     * Inits
     */
    app.init = function()
    {
        panel = new app.controllers.panel();
        panel.on('loaded', $.proxy(_onPanelReady, this));
        panel.load();
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
     * Quits the app
     */
    app.quit = function()
    {
        // @todo kill windows
        // @todo close apache watchers
        app.node.gui.App.quit();
    };

    /**
     * Starts working when the panel is ready
     */
    var _onPanelReady = function()
    {
        _askSudo();
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
        if (answer === 'cancel')
        {
            app.quit();
        }
        if (answer === 'fail')
        {
            app.utils.sudo.ask();
        }
        else
        {
            _initTray();
            _initMenu();
        }
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
        panel.toggle(evt.x, evt.y);
    };

    window.App = app;

})(window, jQuery, require, process);