/**
 * Settings controller
 */
(function(app, $)
{

    'use strict';

    var module = function()
    {

        var events = new app.node.events.EventEmitter();
        var menu;

        /**
         * Attaches an event
         * @param event
         * @param callback
         */
        this.on = function(event, callback)
        {
            events.on(event, callback);
        };

        /**
         * Inits the controller
         */
        this.init = function()
        {
            menu = new app.node.gui.Menu();
            menu.append(new app.node.gui.MenuItem({label: app.locale.settings.about, click: _onAbout}));
            menu.append(new app.node.gui.MenuItem({type: 'separator' }));
            menu.append(new app.node.gui.MenuItem({label: app.locale.settings.quit, click: _onQuit}));
        };

        /**
         * Toggles menu
         * @param x
         * @param y
         */
        this.popup = function(x, y)
        {
            menu.popup(x, y);
        };

        /**
         * Quits the app
         */
        var _onQuit = function()
        {
            app.quit();
        };

        /**
         * Displays "about" view
         * @private
         */
        var _onAbout = function()
        {
            alert('@todo');
        };

    };

    app.controllers.settings = module;

})(window.App, jQuery);