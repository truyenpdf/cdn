(function($) {
    'use strict';

    const CustomRating = {
        init: function(selector, options) {
            this.selector = selector;
            this.options = $.extend({
                maxStars: 5,
                initialRating: 0,
                onRate: function(rating) {}
            }, options);

            this.render();
            this.bindEvents();
        },

        render: function() {
            const $container = $(this.selector);
            $container.empty();
            
            for (let i = 1; i <= this.options.maxStars; i++) {
                const $star = $('<i>', {
                    class: 'rating-star far fa-star',
                    'data-value': i
                });
                $container.append($star);
            }

            this.setRating(this.options.initialRating);
        },

        bindEvents: function() {
            const self = this;
            const $container = $(this.selector);

            $container
                .on('mouseover', '.rating-star', function() {
                    const rating = $(this).data('value');
                    self.highlightStars(rating);
                })
                .on('mouseleave', function() {
                    self.highlightStars(self.options.initialRating);
                })
                .on('click', '.rating-star', function() {
                    const rating = $(this).data('value');
                    self.options.initialRating = rating;
                    self.options.onRate(rating);
                });
        },

        highlightStars: function(rating) {
            const $stars = $(this.selector).find('.rating-star');
            $stars.each(function(index) {
                $(this).toggleClass('fas', index < rating);
                $(this).toggleClass('far', index >= rating);
            });
        },

        setRating: function(rating) {
            this.options.initialRating = rating;
            this.highlightStars(rating);
        }
    };

    $.fn.customRating = function(options) {
        CustomRating.init(this, options);
        return this;
    };
})(jQuery);