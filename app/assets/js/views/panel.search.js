/**
 * Search view
 */
(function(app, $)
{

    'use strict';

    var module = function()
    {

        var $input;

        /**
         * Inits a search input
         * @param $dom
         */
        this.init = function($dom)
        {
            $input = $dom;
            $input.on('keyup', $.proxy(_onSearchList, this)).on('click', function(evt)
            {
                evt.stopPropagation();
            });
        };

        /**
         * Refreshes the view
         */
        this.refresh = function()
        {
            $input.trigger('keyup');
        };

        /**
         * Search
         * @param evt
         */
        var _onSearchList = function(evt)
        {
            var $field = $(evt.currentTarget);
            var items = $field.closest('.js-section').find('.js-search-item').get();
            var search_term = $field.val();
            for (var index = 0; index < items.length; index += 1)
            {
                var $item = $(items[index]);
                $item.toggle($item.find('.js-search-value').text().search(search_term) !== -1);
            }
        };

    };

    app.views.panel.search = module;

})(window.App, jQuery);