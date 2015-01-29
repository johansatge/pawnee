/**
 * Section view
 */
(function(app, $)
{

    'use strict';

    var module = function()
    {

        var events = new app.node.events.EventEmitter();

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
         * Inits sections
         * @param $sections
         */
        this.init = function($sections)
        {
            $sections.find('.js-heading').on('click', $.proxy(_onToggleSection, this));
            $sections.find('.js-clear').on('click', $.proxy(_onClearSection, this));
            var sections = $sections.get();
            for(var index = 0; index < sections.length; index += 1)
            {
                var $section = $(sections[index]);
                if ($section.hasClass('js-section-closed'))
                {
                    _toggleSection.apply(this, [$section, 0]);
                }
            }
        };

        /**
         * Toggles a section when clicking on a heading area
         * @param evt
         */
        var _onToggleSection = function(evt)
        {
            evt.preventDefault();
            events.emit('resize');
            _toggleSection($(evt.currentTarget).closest('.js-section'), 200);
        };

        /**
         * Toggles a section
         * @param $section
         * @param speed
         */
        var _toggleSection = function($section, speed)
        {
            $section.toggleClass('js-closed').find('.js-content').slideToggle({duration: speed, complete: function()
            {
                events.emit('resize');
            }});
            $section.find('.js-search').fadeToggle(speed);
            $section.find('.js-action').fadeToggle(speed);
        };

        /**
         * Clears a section
         * @param evt
         * @private
         */
        var _onClearSection = function(evt)
        {
            evt.preventDefault();
            evt.stopPropagation();
            $(evt.currentTarget).closest('.js-section').find('.js-section-clearable').val('');
        };

    };

    app.views.panel.section = module;

})(window.App, jQuery);