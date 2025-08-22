const FollowHandler = {
    init: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', '.subscribeBook', function(e) {
            e.preventDefault();
            const button = $(this);
            const comicId = button.data('id');

            // Check if user is logged in
            if (typeof login === 'undefined' || login !== 1) {
                $('.shadow_bg').addClass('active');
                $('.show_login').addClass('active');
                return;
            }

            $.ajax({
                type: 'POST',
                url: '/follow', // Updated URL to match route
                data: {
                    comic_id: comicId,
                    _token: $('meta[name="csrf-token"]').attr('content')
                },
                success: function(response) {
                    if (response.success) {
                        if (response.followed) {
                            button.addClass('active');
                            button.find('i').removeClass('bi-bookmark-plus-fill').addClass('bi-bookmark-check-fill');
                            button.find('span').text('Đã Theo Dõi');
                        } else {
                            button.removeClass('active');
                            button.find('i').removeClass('bi-bookmark-check-fill').addClass('bi-bookmark-plus-fill');
                            button.find('span').text('Theo Dõi');
                        }
                        alert(response.message);
                    }
                },
                error: function(xhr) {
                    if (xhr.status === 401) {
                        $('.shadow_bg').addClass('active');
                        $('.show_login').addClass('active');
                    } else {
                        alert('Có lỗi xảy ra, vui lòng thử lại sau');
                    }
                }
            });
        });
    }
};

$(document).ready(function() {
    FollowHandler.init();
});