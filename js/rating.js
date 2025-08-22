(function($) {
    'use strict';

    const RatingSystem = {
        init: function(selector, options) {
            this.selector = selector;
            this.options = Object.assign({
                maxStars: 5,
                initialRating: 0,
                onRate: function(rating) {}
            }, options);

            this.render();
            this.bindEvents();
            this.updateStars(this.options.initialRating);
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
        },

        bindEvents: function() {
            const self = this;
            const $container = $(this.selector);

            $container
                .on('mouseenter', '.rating-star', function() {
                    const rating = $(this).data('value');
                    self.updateStars(rating);
                })
                .on('mouseleave', function() {
                    self.updateStars(self.options.initialRating);
                })
                .on('click', '.rating-star', function() {
                    const rating = $(this).data('value');
                    self.options.initialRating = rating;
                    self.updateStars(rating);
                    self.options.onRate(rating);
                });
        },

        updateStars: function(rating) {
            const $stars = $(this.selector).find('.rating-star');
            $stars.each(function(index) {
                $(this)
                    .removeClass('far fas')
                    .addClass(index < rating ? 'fas' : 'far');
            });
        }
    };

    $.fn.rating = function(options) {
        return this.each(function() {
            const instance = Object.create(RatingSystem);
            instance.init(this, options);
        });
    };
})(jQuery);