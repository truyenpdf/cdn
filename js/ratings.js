(function($) {
    'use strict';

    const RatingSystem = {
        init: function() {
            this.initializeStars();
            this.bindEvents();
        },

        initializeStars: function() {
            const currentRating = $('#star').data('rating') || 0;
            this.renderStars(currentRating);
        },

        renderStars: function(rating) {
            const $container = $('#star');
            $container.empty();

            for (let i = 1; i <= 5; i++) {
                const starClass = i <= rating ? 'fas' : 'far';
                $container.append(`<i class="${starClass} fa-star" data-rating="${i}"></i>`);
            }
        },

        bindEvents: function() {
            const self = this;
            
            $('#star').on('mouseenter', 'i', function() {
                const rating = $(this).data('rating');
                self.highlightStars(rating);
            });

            $('#star').on('mouseleave', function() {
                const currentRating = $(this).data('rating') || 0;
                self.highlightStars(currentRating);
            });

            $('#star').on('click', 'i', function() {
                const rating = $(this).data('rating');
                self.submitRating(rating);
            });
        },

        highlightStars: function(rating) {
            $('#star i').each(function(index) {
                $(this).toggleClass('fas', index < rating);
                $(this).toggleClass('far', index >= rating);
            });
        },

        submitRating: function(rating) {
            const comicId = $('#star').data('comic-id');
            
            $.ajax({
                url: '/comics/rate',
                type: 'POST',
                data: {
                    comic_id: comicId,
                    rating: rating,
                    _token: $('meta[name="csrf-token"]').attr('content')
                },
                success: (response) => {
                    if (response.success) {
                        this.renderStars(rating);
                        $('#star').data('rating', rating);
                        $('.average-rating').text(response.average);
                        $('.total-ratings').text(response.count);
                        alert(response.message);
                    }
                },
                error: (xhr) => {
                    if (xhr.status === 401) {
                        $('.shadow_bg').addClass('active');
                        $('.show_login').addClass('active');
                    } else {
                        alert('Có lỗi xảy ra, vui lòng thử lại sau');
                    }
                }
            });
        }
    };

    $(document).ready(function() {
        RatingSystem.init();
    });
})(jQuery);