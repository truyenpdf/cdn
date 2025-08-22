const ReportUtils = {
    reset: function() {
        $('.shadow_bg').removeClass('active');
        $('.show_reg').removeClass('active');
        $('.show_login').removeClass('active');
        $('.show_pass').removeClass('active');
        $('body').removeClass('active');
    },

    isUserLoggedIn: function() {
        return typeof login !== 'undefined' && login === 1;
    },

    showLogin: function() {
        $('.shadow_bg').addClass('active');
        $('.show_login').addClass('active');
        $('.tab_login').addClass('active');
        $('.tab_reg').removeClass('active');
        $('.show_pass').removeClass('active');
        $('.show_reg').removeClass('active');
    }
};

const ReportHandler = {
    urls: {
        popup: '/report/popup',
        submit: '/report/submit'
    },

    init: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        // Report form submission
        $(document).on('submit', '#reportForm', function(e) {
            e.preventDefault();
            
            const errorType = $('#report_error_type').val();
            const errorText = $('#report_error_description').val();

            if (!errorType || errorType === '') {
                alert('Vui lòng chọn loại lỗi');
                return;
            }

            if (!errorText || errorText.trim() === '') {
                alert('Vui lòng nhập mô tả lỗi');
                return;
            }

            $.ajax({
                type: 'POST',
                url: '/report/submit',
                data: {
                    error_type: errorType,
                    error_text: errorText,
                    chapter_id: $('#episode_id').val(),
                    comic_id: $('#book_id').val(),
                    _token: $('meta[name="csrf-token"]').attr('content')
                },
                success: function(response) {
                    if (response.success) {
                        alert('Cảm ơn bạn đã báo lỗi');
                        $('#reportModal').modal('hide');
                        $('#reportForm')[0].reset();
                    } else {
                        alert(response.message || 'Có lỗi xảy ra, vui lòng thử lại sau');
                    }
                },
                error: function(xhr) {
                    if (xhr.status === 401) {
                        alert('Vui lòng đăng nhập để báo lỗi');
                        $('#reportModal').modal('hide');
                    } else {
                        alert('Có lỗi xảy ra, vui lòng thử lại sau');
                    }
                }
            });
        });

        // Error type change handler
        $(document).on('change', '#report_error_type', function() {
            const note = $(this).find('option:selected').data('note');
            $('.report-note').text(note || '');
        });
    }
};

// Initialize when document is ready
$(document).ready(function() {
    ReportHandler.init();
});