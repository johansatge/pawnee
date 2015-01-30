/**
 * PHP view
 */
(function(app, $)
{

    'use strict';

    var module = function()
    {

        var events = new app.node.events.EventEmitter();
        var $ui = {};

        /**
         * Attaches an event
         * @param event
         * @param callback
         */
        this.on = function(event, callback)
        {
            events.on(event, callback);
            return this;
        };

        /**
         * Inits
         * @param $dom
         */
        this.init = function($dom)
        {
            $ui.loader = $dom.find('.js-load');
            $ui.loader.hide();
        };

        /**
         * Toggles the pending state of the view
         * @param is_pending
         */
        this.togglePendingState = function(is_pending)
        {
            $ui.loader.toggle(is_pending);
        };

    };

    app.views.panel.php = module;

})(window.App, jQuery);