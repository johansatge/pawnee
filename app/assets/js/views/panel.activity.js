/**
 * Activity view
 */
(function(app, $)
{

    'use strict';

    var module = function()
    {

        var $ui = {};

        /**
         * Inits
         * @param $dom
         */
        this.init = function($dom)
        {
            $ui.textarea = $dom.find('textarea');
            $dom.find('.js-clear').on('click', $.proxy(_onClear, this));
        };

        /**
         * Logs activity
         * @param message
         */
        this.logActivity = function(message)
        {
            $ui.textarea.val($ui.textarea.val() + "\n" + message);
            $ui.textarea.scrollTop($ui.textarea[0].scrollHeight - $ui.textarea.height());
        };

        /**
         * Clears the view
         * @param evt
         * @private
         */
        var _onClear = function(evt)
        {
            evt.preventDefault();
            evt.stopPropagation();
            $ui.textarea.val('');
        };

    };

    app.views.panel.activity = module;

})(window.App, jQuery);