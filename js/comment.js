$(document).ready(function () {
    'use strict'
    $('.content-comment').readmore({
        maxHeight: 105,
        speed: 100,
        moreLink: '<p class="readmore"><a href="#">Xem Thêm</a></p>',
        lessLink: '<p class="readmore"><a href="#">Ẩn</a></p>',
        embedCSS: true,
        sectionCSS: 'display: block; width: 100%;',
        startOpen: false,
        expandedClass: 'readmore-js-expanded',
        collapsedClass: 'readmore-js-collapsed'
    });

    // Kiểm tra trạng thái đăng nhập
    var login = $('#login-status').val(); // Giả sử bạn có một input hidden để lưu trạng thái đăng nhập

    // Khóa khung bình luận nếu chưa đăng nhập
    if (login == 0) {
        $('.comment-placeholder').on('click', function () {
            alert('Vui lòng đăng nhập để bình luận!');
        });
    } else {
        $('.comment-placeholder').on('click', function () {
            openComment();
        });
    }
});

function validateEmail(email) {
    var re = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return re.test(email);
}

function validateName(name) {
    // Your validation logic here
}

function openComment() {
    $('.comment-placeholder').addClass('hidden');
    $('.mess-input').removeClass('hidden');
    // Bỏ phần khởi tạo TinyMCE
    $('#content_comment').focus();
}

function loadReply(id) {
    var book_id = $('#book_id').val();
    var team_id = $('#team_id').val();
    var token = $('#csrf-token').val();
    $.ajax({
        method: "POST",
        url: urlCommentLoad,
        data: { book_id: book_id, parent_id: id, team_id: team_id, token: token }
    }).done(function (html) {
        $(".list-comment .child_" + id).append(html);
        $(".load_child_" + id).html('');
        $('.list-comment .content-comment').readmore({
            maxHeight: 105,
            speed: 100,
            moreLink: '<p class="readmore"><a href="#">Show More</a></p>',
            lessLink: '<p class="readmore"><a href="#">Hide Away</a></p>',
            embedCSS: true,
            sectionCSS: 'display: block; width: 100%;',
            startOpen: false,
            expandedClass: 'readmore-js-expanded',
            collapsedClass: 'readmore-js-collapsed'
        });
        lazyload();
    });
}

function loadComment(page) {
    var book_id = $('#book_id').val();
    var episode_id = $('#episode_id').val();
    var team_id = $('#team_id').val();
    $.ajax({
        method: "POST",
        url: urlCommentLoad,
        data: { book_id: book_id, parent_id: 0, page: page, episode_id: episode_id, team_id: team_id }
    }).done(function (html) {
        $(".list-comment").html(html);
        $('.list-comment .content-comment').readmore({
            maxHeight: 105,
            speed: 100,
            moreLink: '<p class="readmore"><a href="#">Show More</a></p>',
            lessLink: '<p class="readmore"><a href="#">Hide Away</a></p>',
            embedCSS: true,
            sectionCSS: 'display: block; width: 100%;',
            startOpen: false,
            expandedClass: 'readmore-js-expanded',
            collapsedClass: 'readmore-js-collapsed'
        });
        lazyload();
    });
}

function addReply(id) {
    if (login == 0) {
        alert('Vui lòng đăng nhập để bình luận.');
        return;
    }
    
    $('.repcomment_id_' + id).removeClass('hidden');
    $('#content_comment_' + id).focus();
}

function sendComment(that) {
    const reply_id = $(that).data("id");
    const parent = $(that).data("parent");
    const reply_name = $(that).data("replyname");
    const book_id = $('#book_id').val();
    
    // Lấy nội dung từ textarea thông thường
    let content = reply_id ? 
        $(`#content_comment_${reply_id}`).val().trim() : 
        $('#content_comment').val().trim();

    if (!content) {
        alert('Vui lòng nhập nội dung bình luận');
        return;
    }

    // Kiểm tra số lượng emoji
    const emojiCount = (content.match(/:\w+:/g) || []).length;
    if (emojiCount > 3) {
        alert('Bạn không thể sử dụng quá 3 emoji');
        return;
    }

    $.ajax({
        method: "POST",
        url: '/comments', // Sử dụng URL tương đối
        data: {
            _token: $('meta[name="csrf-token"]').attr('content'),
            comic_id: book_id,
            content: content,
            parent_id: parent || 0,
            reply_id: reply_id,
            reply_name: reply_name
        }
    }).done(function(response) {
        if (response.success) {
            if (reply_id) {
                $('.child_' + reply_id).after(response.html);
                $(`#content_comment_${reply_id}`).val('');
                $('.repcomment_id_' + reply_id).addClass('hidden');
            } else {
                $('.list-comment').prepend(response.html);
                $('#content_comment').val('');
            }

            // Cập nhật số lượng comment
            $('.comment-count').text(response.total_comments);

            // Khởi tạo readmore cho comment mới
            $('.content-comment').readmore({
                maxHeight: 105,
                speed: 100,
                moreLink: '<p class="readmore"><a href="#">Xem Thêm</a></p>',
                lessLink: '<p class="readmore"><a href="#">Ẩn</a></p>',
                embedCSS: true,
                sectionCSS: 'display: block; width: 100%;',
                startOpen: false
            });
        } else {
            alert(response.message || 'Có lỗi xảy ra');
        }
    }).fail(function(xhr) {
        if (xhr.status === 401) {
            window.location.href = '/login';
        } else {
            alert('Có lỗi xảy ra khi gửi bình luận');
        }
    });
}

function removeComment(id) {
    var book_id = $('#book_id').val();
    var token = $('#csrf-token').val();
    var result = confirm("Bạn muốn xoá bình luận à?");
    if (result == true) {
        $.ajax({
            method: "POST",
            url: urlCommentRemove,
            data: { id: id, book_id: book_id, token: token }
        }).done(function (data) {
            $('.list-comment .parent_' + id).remove();
            $('.list-comment .child_' + id).remove();
        });
    }
}

function lazyload() {
    $('.lazy-image').Lazy({
        enableThrottle: true,
        throttle: 0,
        attribute: "data-src",
        effect: "show",
        afterLoad: function (element) {
            element.removeClass('lazy-image');
        },
    });
}

function insertEmoji(emoji) {
    const textarea = document.activeElement;
    if (!textarea || textarea.tagName !== 'TEXTAREA') return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    
    textarea.value = text.substring(0, start) + 
                    ' ' + emoji + ' ' + 
                    text.substring(end);
    
    // Di chuyển con trỏ về sau emoji
    const newPos = start + emoji.length + 2;
    textarea.setSelectionRange(newPos, newPos);
    textarea.focus();
}