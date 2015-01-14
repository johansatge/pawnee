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
    app.node.watcher = require('chokidar');
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
     * Starts working when the panel is ready
     */
    var _onPanelReady = function()
    {
        _initTray();
        _initWatchers();

        // @todo remove
        var mb = new app.node.gui.Menu({type: "menubar"});
        mb.createMacBuiltin("your-app-name");
        app.node.gui.Window.get().menu = mb;
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
     * Starts watching Apache files
     * @todo do not keep hard-coded paths
     * @todo close watcher when closing app - watcher.close()
     */
    var _initWatchers = function()
    {
        var watcher = app.node.watcher.watch('/etc/apache2/httpd.conf', {persistent: true});
        watcher.add('/usr/libexec/apache2');
        watcher.on('change', $.proxy(_onApacheWatcherUpdate, this));
        watcher.on('ready', $.proxy(_onApacheWatcherUpdate, this));
    };

    /**
     * Updates UI when an Apache file changes
     */
    var _onApacheWatcherUpdate = function()
    {
        panel.updateConfiguration();
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