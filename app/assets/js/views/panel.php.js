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
            $ui.versionSelect = $dom.find('.js-php-version');
            $ui.versionSelect.on('change', $.proxy(_onChangeVersion, this));
        };

        /**
         * Sets available versions
         * @param versions
         */
        this.setVersions = function(versions)
        {
            $ui.versionSelect.html('');
            for (var index = 0; index < versions.length; index += 1)
            {
                var selected = versions[index].current ? 'selected="selected" ' : '';
                var option = '<option ' + selected + 'value="' + versions[index].value + '">' + versions[index].name + '</option>';
                $ui.versionSelect.append(option);
            }
        };

        /**
         * Toggles the pending state of the view
         * @param is_pending
         */
        this.togglePendingState = function(is_pending)
        {
            $ui.loader.toggle(is_pending);
        };

        /**
         * Changes the current PHP version
         * @param evt
         */
        var _onChangeVersion = function(evt)
        {
            events.emit('action', 'php_version', $(evt.currentTarget).val());
        };

    };

    app.views.panel.php = module;

})(window.App, jQuery);