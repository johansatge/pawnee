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
            $dom.find('.js-php-package').on('change', $.proxy(_onSelectPackage, this));
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
                $ui.versionSelect.append('<option value="' + versions[index].value + '">' + versions[index].name + '</option>');
            }
        };

        /**
         * Sets available packages
         * @param packages
         */
        this.setPackages = function(packages)
        {
            app.log('@todo set php packages');
            app.log(packages);
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

        /**
         * Selecting a PHP package
         * @param evt
         */
        var _onSelectPackage = function(evt)
        {
            events.emit('action', 'php_package', $(evt.currentTarget).val());
        };

    };

    app.views.panel.php = module;

})(window.App, jQuery);