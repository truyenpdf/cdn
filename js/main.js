$(document).ready(function () {
    'use strict'
        var isMobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i)
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i)
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i)
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i)
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i)
        },
        any: function () {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows())
        }
    }

    $('.icon_setting').click(function () {
        $('.box_setting_detail').toggleClass('active');
        $('.icon_setting').toggleClass('active');
    });

    $(document).on( "click", ".tab_reg", function( event ) {
        $('.show_reg').addClass('active');
        $('.show_login').removeClass('active');
        $('.tab_reg').addClass('active');
        $('.tab_login').removeClass('active');
        $('.show_pass').removeClass('active');
    });
    $(document).on( "click", ".tab_login", function( event ) {
        $('.show_reg').removeClass('active');
        $('.show_login').addClass('active');
        $('.tab_reg').removeClass('active');
        $('.tab_login').addClass('active');
        $('.show_pass').removeClass('active');

    });
    $(document).on( "click", ".forgot_pass", function( event ) {
        $('.show_reg').removeClass('active');
        $('.show_login').removeClass('active');
        $('.show_pass').addClass('active');
        $('.tab_reg').removeClass('active');
        $('.tab_login').removeClass('active');
    });


    $(document).click(function () {
        "use strict";
        // remove active menu outline
        $('.more_menu').removeClass('active');
        $('.category-popup').removeClass('active');
    });
    
    $(document).on("keypress", ".show_login input",function (e) {
        if(e.which == 13) {
            var textError = "";
            if ($('#email_login').val().trim() == "") {
                textError += "Email là bắt buộc nhập.\n";
            } else if (validateEmail($('#email_login').val().trim()) == false) {
                textError += "Email không đúng định dạng.\n";
            }
            if ($('#password_login').val().trim() == "") {
                textError += "Mật khẩu là bắt buộc nhập.\n";
            } else if ($('#password_login').val().trim().length <= 6) {
                textError += "Mật khẩu phải lớn hơn 6 ký tự.\n";
            }
            if (textError != "") {
                alert(textError);
            } else {
                $.ajax({
                    type: 'POST',
                    cache: false,
                    url: urlLogin,
                    dataType: "json",
                    data: {email: $('#email_login').val(), password: $('#password_login').val(), expire: 1},
                    success: function (dataResult) {
                        if (dataResult['status'] == '0') {
                            var textError = "";
                            for (var key in dataResult['error']) {
                                textError += dataResult['error'][key] + "\n";
                            }
                            alert(textError);
                            event.preventDefault();
                        } else {
                            location.reload(true);
                        }
                    }
                });
            }
        }
    });
    $('#search_input').click(function(){
        var keyWord = $(this).val();
        var token = $('#csrf-token').val();
        if($(this).val() != '' && $('.show_result_search').hasClass('open') == false){
            $.ajax({
                type: "POST",
                url: urlSearch,
                data: { search: keyWord, type: 0, token: token}
            }).done(function( msg ) {
                $('.show_result_search').addClass('open');
                $('.show_result_search ul').html(msg);
            });
        }else if($('.show_result_search ul').html().trim() != ''){
            $('.show_result_search').addClass('open');
        }
    });
    $('#order-chapter').click(function(){
        var chap_id = $('#episode_id').val();
        var book_id = $('#book_id').val();
        var type_book = $('#type_book').val();
        var token = $('#csrf-token').val();
        $.ajax({
            type: "POST",
            url: urlOrderChap,
            data: {chap_id: chap_id, book_id: book_id, type_book: type_book, token: token}
        }).done(function(json) {
            var dataReturn = JSON.parse(json);
            if(dataReturn.status == 1){
                location.reload();
            }else{
                alert(dataReturn.message)
            }
        });
    });

    $('body').click(function(event) {
        if (!$(event.target).closest('.show_result_search').length && !$(event.target).closest('#search_input').length) {
            $('.show_result_search').removeClass('open');
        }
        if (!$(event.target).closest('.notification').length && !$(event.target).closest('.icon-notification').length) {
            $('.notification').addClass('hidden')
        }
        if (!$(event.target).closest('.inline-login .setting').length && !$(event.target).closest('.icon-profile').length) {
            $('.inline-login .setting').addClass('hidden')
        }
    })
    $(document).on("click", '.icon-notification', function (event) {
        if($('.notification').hasClass('hidden')){
            $('.notification').removeClass('hidden');
            if($('#id_notification').val() != ''){
                $.ajax({
                    type: 'POST',
                    cache: false,
                    url: urlNotification,
                    data: {id: $('#id_notification').val()},
                    success: function(data){
                        $('.icon-notification amount').addClass('hidden');
                        $('#id_notification').val('');
                    }
                });
            }
        }else{
            $('.notification').addClass('hidden');
        }
    })
    $(document).on("click", '.icon-profile', function (event) {
        if($('.inline-login .setting').hasClass('hidden')){
            $('.inline-login .setting').removeClass('hidden');
        }else{
            $('.inline-login .setting').addClass('hidden');
        }
    })
   

    $(document).on("click", '.button_login', function (event) {
        var textError = "";
        var token = $('#csrf-token').val();
        if($('#email_login').val().trim() == ""){
            textError += "Email là bắt buộc nhập.\n";
        }else if(validateEmail($('#email_login').val().trim()) == false){
            textError += "Email không đúng định dạng.\n";
        }
        if($('#password_login').val().trim() == ""){
            textError += "Mật khẩu là bắt buộc nhập.\n";
        }else if($('#password_login').val().trim().length <= 6){
            textError += "Mật khẩu phải lớn hơn 6 ký tự.\n";
        }
        if(textError != ""){
            alert(textError);
        }else{
            $.ajax({
                type: 'POST',
                cache: false,
                url: urlLogin,
                dataType: "json",
                data: {email: $('#email_login').val(),  password: $('#password_login').val(), expire: 1, token: token},
                success: function(dataResult){
                    if(dataResult['status'] == '0'){
                        var textError = "";
                        for (var key in dataResult['error']) {
                            textError += dataResult['error'][key] + "\n";
                        }
                        alert(textError);
                        event.preventDefault();
                    }else{
                        location.reload(true);
                    }
                }
            });
        }
    });


    $(".btn-search").click(function() {
        var e = $(".btn-reset").attr("href"),
            t = "",
            a = "",
            n = "",
            i = "";
        $.each($(".genre-item span"), function(e, o) {
            $(o).hasClass("icon-tick") ? (t += n + $(o).attr("data-id"), n = ",") : $(o).hasClass("icon-cross") && (a += i + $(o).attr("data-id"), i = ",")
        })
        location.href = e + "?category=" + t + "&notcategory=" + a + "&country=" + $("#country").val() + "&status=" + $("#status").val() + "&minchapter=" + $("#minchapter").val() + "&sort=" + $("#sort").val()
    })


    $(document).on('click', ".subscribeBook", function() {
        var selector = $(this);
        var id = selector.data('id');
        var page = selector.data('page');
        var token = $('#csrf-token').val();
        if(login == 0){
            popup('login');
        }else{
            $.ajax({
                url: urlSubcribe,
                type: "POST",
                data: {id: id, token: token},
                success: function (data) {
                    if (data != '') {
                        if(page == 'index'){
                            if (data == 0) {
                                selector.html('<i class="bi bi-bookmark-plus-fill"></i> Theo Dõi');
                            } else {
                                selector.html('<i class="bi bi-bookmark-dash-fill"></i> Bỏ Theo Dõi');
                            }
                        }else{
                            if (data == 0) {
                                selector.html('<i class="bi bi-bookmark-plus-fill"></i> <span>Theo Dõi</span>');
                                selector.removeClass('btn-unsubscribe').addClass('btn-subscribe');
                            } else {
                                selector.html('<i class="bi bi-bookmark-dash-fill"></i> <span>Bỏ Theo Dõi</span>');
                                selector.removeClass('btn-subscribe').addClass('btn-unsubscribe');
                            }
                        }
                    }
                }
            });
        }

    });
    $('.story-detail-info').readmore({
        maxHeight: 60,
        speed: 100,
        moreLink: '<p class="readmore"><a href="#">Xem Thêm</a></p>',
        lessLink: '<p class="readmore"><a href="#">Thu Gọn</a></p>',
        embedCSS: true,
        sectionCSS: 'display: block; width: 100%;',
        startOpen: false,
        expandedClass: 'readmore-js-expanded',
        collapsedClass: 'readmore-js-collapsed'
    });
    var runlike = 0;
    $(document).on('click', ".btn-like", function() {
        var selector = $(this);
        var id = selector.data('id');
        if(runlike == 0){
            runlike = 1;
            $.ajax({
                url: urlLike,
                type: "POST",
                data: {id: id},
                success: function (data) {
                    data = $.parseJSON(data);
                    if(data['success'] == 1){
                        $('.number-like').text(parseInt($('.number-like').text()) + 1);
                    }else{
                        alert(data['error']);
                    }
                    runlike = 0;
                }
            });
        }
    });

    // $(document).on('click', '#submit_error', function() {
    //     let errorType = $('#report_error_title').val();
    //     let errorText = $('#report_error_text').val();
        
    //     if(errorType == '0') {
    //         alert('Vui lòng chọn loại lỗi');
    //         return;
    //     }

    //     if(errorText.trim() == '') {
    //         alert('Vui lòng nhập mô tả lỗi');
    //         return;
    //     }

    //     $.ajax({
    //         type: 'POST',
    //         url: '/report/submit',
    //         data: {
    //             error_type: errorType,
    //             error_text: errorText,
    //             chapter_id: $('#episode_id').val(),
    //             comic_id: $('#book_id').val(),
    //             _token: $('meta[name="csrf-token"]').attr('content')
    //         },
    //         success: function(response) {
    //             if(response.success) {
    //                 alert(response.message);
    //                 reset();
    //             } else {
    //                 alert('Có lỗi xảy ra, vui lòng thử lại sau');
    //             }
    //         },
    //         error: function(xhr) {
    //             if(xhr.status === 401) {
    //                 alert('Vui lòng đăng nhập để báo lỗi');
    //             } else {
    //                 alert('Có lỗi xảy ra, vui lòng thử lại sau');
    //             }
    //         }
    //     });
    // });

    var runLikeComment = 0;
    $(document).on('click', ".like-comment", function() {
        var selector = $(this);
        var id = selector.data('id');
        if(runLikeComment == 0){
            runLikeComment = 1;
            $.ajax({
                url: urlLikeComment,
                type: "POST",
                data: {id: id},
                success: function (data) {
                    data = $.parseJSON(data);
                    if(data['success'] == 1){
                        selector.find('.total-like-comment').text(parseInt(selector.find('.total-like-comment').text()) + 1);
                    }else{
                        alert(data['error']);
                    }
                    runLikeComment = 0;
                }
            });
        }
    });
    $(document).on('click', ".dislike-comment", function() {
        var selector = $(this);
        var id = selector.data('id');
        if(runLikeComment == 0){
            runLikeComment = 1;
            $.ajax({
                url: urlDisLikeComment,
                type: "POST",
                data: {id: id},
                success: function (data) {
                    data = $.parseJSON(data);
                    if(data['success'] == 1){
                        selector.find('.total-dislike-comment').text(parseInt(selector.find('.total-dislike-comment').text()) + 1);
                    }else{
                        alert(data['error']);
                    }
                    runLikeComment = 0;
                }
            });
        }
    });
    $(".remove-subscribe").click(function() {
        var id = $(this).data('id');
        $.ajax({
            url: linkRemoveSubscribe,
            type: "POST",
            data: {id:id},
            success: function(data){
                location.reload(true);
            }
        });
    });
    $(".request_button").click(function() {
        var book_id = $('#book_id').val();
        $.ajax({
            url: urlRequest,
            type: "POST",
            data: {book_id:book_id},
            success: function(data){
                data = $.parseJSON(data);
                if(data['status'] == 1){
                    alert(data['success']);
                }else{
                    var txtError = '';
                    for (var key in data['error']) {
                        txtError += data['error'][key] + '\n';
                    }
                    alert(txtError);
                }
            }
        });
    });
    $(".remove-history").click(function() {
        var id = $(this).data('id');
        var token = $('#csrf-token').val();
        $.ajax({
            url: urlHistory,
            type: "POST",
            data: {id:id, token: token},
            success: function(data){
                location.reload(true);
            }
        });
    });
    $(".story-list-bl01 .text-center .btn-collapse").click(function() {
        if($(".story-list-bl01 .text-center .btn-collapse .show-text").hasClass('hidden')){
            $(".story-list-bl01 .text-center .btn-collapse .show-text").removeClass('hidden');
            $(".story-list-bl01 .text-center .btn-collapse .hide-text").addClass('hidden');
            $(".advsearch-form").addClass('hidden');
        }else{
            $(".story-list-bl01 .text-center .btn-collapse .hide-text").removeClass('hidden');
            $(".story-list-bl01 .text-center .btn-collapse .show-text").addClass('hidden');
            $(".advsearch-form").removeClass('hidden');
        }
    });
    $(".genre-item").click(function() {
        var e = $(this).find("span");
        e.hasClass("icon-checkbox") ? e.removeClass("icon-checkbox").addClass("icon-tick") : e.hasClass("icon-tick") ? e.removeClass("icon-tick").addClass("icon-cross") : e.removeClass("icon-cross").addClass("icon-checkbox")
    })
    $(window).scroll(function() {
        $(this).scrollTop() > 100 ? $("#back-to-top").fadeIn() : $("#back-to-top").fadeOut()
    });
    $("#back-to-top").click(function() {
        return $("body,html").animate({
            scrollTop: 0
        }, 800), !1
    })
    $(document).on('change', ".selectEpisode", function() {
        window.location.href = $(this).val();
    });

    if (window.location.hash == '#_=_'){
        if (history.replaceState) {
            var cleanHref = window.location.href.split('#')[0];
            history.replaceState(null, null, cleanHref);
        } else {
            window.location.hash = '';
        }
    }
    $('#category').change(function(){
        window.location.href = $(this).val();
    });
    $('#category-sort').change(function(){
        window.location.href = $(this).val();
    });

    if (typeof NodeList.prototype.forEach !== 'function')  {
        NodeList.prototype.forEach = Array.prototype.forEach;
    }
    $(document).on( "keyup", "body", function( event ) {
        if (
            !$(event.target).closest('.search_result').length && !$(event.target).closest('#search_input').length
            && !$(event.target).closest('.comment-container textarea').length
        ) {
            switch (event.keyCode) {
                case 37:
                    var linkPrev = $('.pre_chap').attr('href');
                    if(typeof linkPrev != 'undefined') {
                        window.location = linkPrev;
                    }
                    break;
                case 39:
                    var linkNext = $('.next_chap').attr('href');
                    if(typeof linkNext != 'undefined'){
                        window.location = linkNext;
                    }
                    break;
            }
        };
    })

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && getCookie('setting_dark_mode') == false) {
        $('body').removeClass('light-style').addClass('dark-style');
        setCookie('setting_dark_mode','dark');
    }

    $(document).on( "click", ".select-background span", function(event) {
        var strClass = 'light-style ' + $(this).data('style');
        if($('body').hasClass('dark-style')){
            strClass = 'dark-style ' + $(this).data('style');
        }
        $('body').attr('class', strClass);
        $('.select-background span').removeClass('active');
        $(this).addClass('active');
        setCookie2('select-background', $(this).data('style'), 157680000);
    })
    $(document).on( "click", ".icon_minus", function(event) {
        var size = parseInt($('.select-size').text()) - 1;
        var lineHeight = (parseInt($('.select-size').text()) - 1) + 10;
        if(size > 13){
            $(".content_detail").css("font-size", size + 'px');
            $(".content_detail").css("line-height", lineHeight + 'px');
            $('.select-size').text(size);
            setCookie2('select-size', size, 157680000);
        }
    })
    $(document).on( "click", ".icon_plus", function(event) {
        var size = parseInt($('.select-size').text()) + 1;
        var lineHeight = (parseInt($('.select-size').text()) + 1) + 10;
        if(size < 29){
            $(".content_detail").css("font-size", size + 'px');
            $(".content_detail").css("line-height", lineHeight + 'px');
            $('.select-size').text(size);
            setCookie2('select-size', size, 157680000);
        }
    })
    $(document).on( "change", ".select-font", function(event) {
        var font = $(this).find(":selected").text();
        $(".content_detail").css("font-family", font);
        setCookie2('select-font', font, 157680000);
    })
    $('#list-category').change(function(){
        window.location.href = $(this).val();
    });
    $(document).on( "click", ".btn_search", function(event) {
        var text = $('#search_input').val().trim();
        if(text != '' && text.length > 2){
            window.location.href = document.location.origin + "/tim-kiem.html?q=" + text;
        }
    })
    $(document).on( "click", ".sorting_chap i", function(event) {
        if($(this).hasClass( "bi-sort-down" )){
            $(this).removeClass("bi-sort-down");
            $(this).addClass("bi-sort-down-alt");
        }else{
            $(this).removeClass("bi-sort-down-alt");
            $(this).addClass("bi-sort-down");
        }
        var list = $('.list_chap');
        var listItems = list.children('li');
        list.append(listItems.get().reverse());
    })

})
function findChapter() {
    var e = $(".chapter-list-modal input").val();
    e.length > 0 ? (e = e.toLowerCase(), $(".chapter-list-modal .chapter-list a").each((function() {
        var t = $(this).text().toLowerCase().replace("chương ", "");
        t.indexOf(":") > -1 && (t = t.substring(0, t.indexOf(":") + 1)), 0 == t.indexOf(e) ? $(this).show() : $(this).hide()
    }))) : $(".chapter-list-modal a").show()
}
function findList() {
    var e = $(".sorting_chap input").val();
    e.length > 0 ? (e = e.toLowerCase(), $(".list_chap a").each((function() {
        var t = $(this).text().toLowerCase().replace("chương ", "");
        t.indexOf(":") > -1 && (t = t.substring(0, t.indexOf(":") + 1)), 0 == t.indexOf(e) ? $(this).parent().parent().show() : $(this).parent().parent().hide()
    }))) : $(".list_chap a").show()
}
function setting_active_dark_mode(e){
    setting_dark_mode = getCookie('setting_dark_mode');
    if(setting_dark_mode == 'light' || setting_dark_mode == false){
        setCookie('setting_dark_mode','dark');
        $('body').removeClass('light-style').addClass('dark-style');
        $('footer').removeClass('light-style').addClass('dark-style');
        $('#setting_dark_mode i').removeClass('bi bi-moon-stars-fill').addClass('bi bi-brightness-high-fill');
    }else{
        setCookie('setting_dark_mode','light');
        $('body').removeClass('dark-style').addClass('light-style');
        $('footer').removeClass('dark-style').addClass('light-style');
        $('#setting_dark_mode i').removeClass('bi bi-brightness-high-fill').addClass('bi bi-moon-stars-fill');
    }
}

function setting_type_book(e){
    type_book = getCookie('type_book');
    if(type_book == 0 || type_book == false){
        let text = "Bạn có muốn chuyển qua đọc Truyện Tranh không?";
        if (confirm(text) == true) {
            setCookie('type_book','1');
            location.reload();
        }
    }else{
        let text = "Bạn có muốn chuyển qua đọc Truyện Chữ không?";
        if (confirm(text) == true) {
            setCookie('type_book', '0');
            location.reload();
        }
    }
}
function setCookie(name, value, hours) {
    var expires="";
    if(!hours){
        hours = 8760;
    }
    var date=new Date();
    date.setTime(date.getTime() + (hours*60*60*1000));
    expires="; expires="+date.toUTCString();
    document.cookie=name+"="+(value||"")+expires+"; path=/";
}
function setCookie2(name, value, time) {
    var expires="";
    var date=new Date();
    date.setTime(date.getTime() + (time*1000));
    expires="; expires="+date.toUTCString();
    document.cookie=name+"="+(value||"")+expires+"; path=/";
}
function getCookie(name){
    var pattern = RegExp(name + "=.[^;]*")
    matched = document.cookie.match(pattern)
    if(matched){
        var cookie = matched[0].split('=')
        return decodeURI(cookie[1])
    }
    return false
}
function deleteCookie(name){
    document.cookie=name+'=; Max-Age=-99999999;';
}


function reset(){
    $('.shadow_bg').removeClass('active');
    $('.show_reg').removeClass('active');
    $('.show_login').removeClass('active');
    $('.show_pass').removeClass('active');
    $('body').removeClass('active');
}

function showRegister(){
    $('.shadow_bg').addClass('active');
    $('.show_reg').addClass('active');
    $('.tab_reg').addClass('active');
    $('.tab_login').removeClass('active');
    $('.show_pass').removeClass('active');
    $('.show_login').removeClass('active');
}
function showLogin(){
    $('.shadow_bg').addClass('active');
    $('.show_login').addClass('active');
    $('.tab_login').addClass('active');
    $('.tab_reg').removeClass('active');
    $('.show_pass').removeClass('active');
    $('.show_reg').removeClass('active');
}



// Update the initReportHandlers function
function initReportHandlers() {
    // Remove existing handlers
    $(document).off('click', '#submit_report');
    $(document).off('change', '#report_error_type');

    // Add new handlers with correct selectors
    $(document).on('click', '#submit_report', function() {
        let errorType = $('#report_error_type').val();
        let errorText = $('#report_error_description').val();
        
        if (!errorType || errorType === '0') {
            alert('Vui lòng chọn loại lỗi');
            return;
        }

        if (!errorText || errorText.trim() === '') {
            alert('Vui lòng nhập mô tả lỗi');
            return;
        }

        // Check login status
        if (!isUserLoggedIn()) {
            showLogin();
            return;
        }

        submitReport(errorType, errorText);
    });

    // Initialize select box change handler
    $(document).on('change', '#report_error_type', function() {
        let selectedNote = $(this).find('option:selected').attr('note');
        $('.report-note').text(selectedNote || 'Mô tả chi tiết lỗi.');
    });
}

function submitReport(errorType, errorText) {
    $.ajax({
        type: 'POST',
        url: URLS.report.submit,
        data: {
            error_type: errorType,
            error_text: errorText,
            chapter_id: $('#episode_id').val(),
            comic_id: $('#book_id').val(),
            _token: $('meta[name="csrf-token"]').attr('content')
        },
        success: function(response) {
            if (response.success) {
                alert(response.message || 'Cảm ơn bạn đã báo lỗi');
                reset();
            } else {
                alert('Có lỗi xảy ra, vui lòng thử lại sau');
            }
        },
        error: function(xhr) {
            if (xhr.status === 401) {
                showLogin();
            } else {
                alert('Có lỗi xảy ra, vui lòng thử lại sau');
            }
        }
    });
}

// Helper function to check login status
function isUserLoggedIn() {
    return typeof login !== 'undefined' && login === 1;
}

function captcha(type_action){
    $.ajax({
        type: 'get',
        cache: false,
        url: urlCaptcha,
        cache: false,
        dataType: "json",
        success: function(data){
            if(type_action == 'register'){
                $('.register-captcha img').attr('src', data['imgCaptcha']);
                $('.register-captcha #captcha-register').val(data['idCaptcha']);
            }else if(type_action == 'forgot'){
                $('.forgot-captcha img').attr('src', data['imgCaptcha']);
                $('.forgot-captcha #captcha-forgot').val(data['idCaptcha']);
            }
        }
    });
}

function registerUser(){
    var textError = "";
    if($('#email_register').val().trim() == ""){
        textError += "Email là bắt buộc nhập.\n";
    }else if(validateEmail($('#email_register').val().trim()) == false){
        textError += "Email không đúng định dạng.\n";
    }

    if($('#password_register').val().trim() == ""){
        textError += "Mật khẩu là bắt buộc nhập.\n";
    }else if($('#password_register').val().trim().length <= 6){
        textError += "Mật khẩu phải lớn hơn 6 ký tự.\n";
    }

    if($('#captcha_register').val().trim() == ""){
        textError += "Mã xác nhận là bắt buộc nhập.\n";
    }
    var token = $('#csrf-token').val();
    if(textError != ""){
        captcha('register');
        alert(textError);
    }else {
        $.ajax({
            type: 'POST',
            cache: false,
            url: urlRegister,
            dataType: "json",
            data: {
                email: $('#email_register').val().trim(),
                password: $('#password_register').val().trim(),
                captcha: $('#captcha_register').val().trim(),
                id_captcha: $('#captcha-register').val().trim(),
                expire: 1,
                token: token
            },
            success: function (dataResult) {
                if (dataResult['status'] == '0') {
                    var textError = "";
                    for (var key in dataResult['error']) {
                        textError += dataResult['error'][key] + "\n";
                    }
                    alert(textError);
                } else {
                    location.reload(true);
                }
            }
        });
    }
}

function validateEmail(email) {
    var re = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return re.test(email);
}
function changeValue(idName, idSlug){
    var name = document.getElementById(idName).value;
    slug = name.toLowerCase();
    slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
    slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
    slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
    slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
    slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
    slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
    slug = slug.replace(/đ/gi, 'd');
    slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '')
    slug = slug.replace(/ /gi, "-");
    slug = slug.replace(/\-\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-/gi, '-');
    slug = slug.replace(/\-\-/gi, '-');
    slug = '@' + slug + '@';
    slug = slug.replace(/\@\-|\-\@|\@/gi, '');
    document.getElementById(idSlug).value = slug;
}

var runRating = 0;
function ratingStar(rating, id){
    if(runRating == 0){
        runRating = 1;
        $.ajax({
            url: urlRating,
            type: "POST",
            data: {id: id, rating: rating},
            success: function (data) {
                data = $.parseJSON(data);
                if(data['success'] == 1){

                }else{
                    alert(data['error']);
                }
                runRating = 0;
            }
        });
    }
}
function changeServer(server) {
    $(".chapter-control .btn-success").removeClass("btn-success").addClass("btn-primary");
    $(".server_" + server).removeClass("btn-primary").addClass("btn-success");
    if(server == '1'){
        $(".content_detail_manga img").each(function() {
            var link = $(this).attr("data-original");
            $(this).attr("src", $(this).attr("data-original"));
        });
        $(".icon_server i span").text(1);
    }else if(server == '2'){
        $(".content_detail_manga img").each(function() {
            var link = $(this).attr("data-cdn");
            $(this).attr("src", link);
        });
        $(".icon_server i span").text(2);
    }
}
$(document).on('click', '.icon_server', function(){
    var server = parseInt($(this).find('span').text());
    var max = parseInt($('.loadchapter:visible').length);
    if(server < max){
        changeServer(server + 1);
    }else{
        changeServer(1);
    }
    if($('.content_detail_manga img.lazy').last().attr("data-cdn") !== undefined){
        $('.server-chap').show();
    }
});