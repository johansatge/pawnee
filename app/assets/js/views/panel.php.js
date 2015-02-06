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
            $ui.packageSelect = $dom.find('.js-php-package');
            $ui.packageSelect.on('change', $.proxy(_onSelectPackage, this));
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
         * Sets available packages
         * @param packages
         */
        this.setPackages = function(packages)
        {
            $ui.packageSelect.html('<option value="">' + app.locale.apache.php_packages + '</option>');
            for (var index = 0; index < packages.length; index += 1)
            {
                var disabled = packages[index].installed ? 'disabled="disabled" ' : '';
                var name = packages[index].name + (packages[index].installed ? ' ' + app.locale.apache.php_installed_package : '');
                var option = '<option ' + disabled + 'value="' + packages[index].value + '">' + name + '</option>';
                $ui.packageSelect.append(option);
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

        /**
         * Selecting a PHP package
         * @param evt
         */
        var _onSelectPackage = function(evt)
        {
            var $select = $(evt.currentTarget);
            events.emit('action', 'php_package', $select.val());
            $select.val('').find('option:selected').removeAttr('selected');
        };

    };

    app.views.panel.php = module;

})(window.App, jQuery);