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
        var about = false;

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
            menu.append(new app.node.gui.MenuItem({label: app.locale.settings.about, click: $.proxy(_onAbout, this)}));
            menu.append(new app.node.gui.MenuItem({type: 'separator' }));
            menu.append(new app.node.gui.MenuItem({label: app.locale.settings.quit, click: $.proxy(_onQuit, this)}));
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
         * Displays "About" view
         */
        var _onAbout = function()
        {
            if (about === false)
            {
                about = new app.views.about();
                about.init();
                about.on('close', $.proxy(_onAboutClose, this));
            }
            else
            {
                about.focus();
            }
        };

        /**
         * Closes "About" view
         */
        var _onAboutClose = function()
        {
            about.close();
            about = false;
        };

    };

    app.controllers.settings = module;

})(window.App, jQuery);