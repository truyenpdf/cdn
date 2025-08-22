$(document).ready(function() {
    let searchTimeout;
    const searchInput = $('#search_input');
    const resultsList = $('.list_result_search');
    const minChars = 2; // Minimum characters 
    const debounceTime = 1000; // Match their 1 second delay

    // Handle keyboard input
    searchInput.on('keyup', function(event) {
        const query = $(this).val().trim();
        const key = event.keyCode;
        
        // Skip for navigation keys
        if (key === 38 || key === 40 || key === 37 || key === 39) {
            return;
        }

        // Handle enter key
        if (key === 13 && query.length > 0) {
            if ($('.show_result_search .active').length === 0) {
                window.location.href = `/tim-kiem?q=${encodeURIComponent(query)}`;
                return;
            }
        }

        clearTimeout(searchTimeout);
        
        if (!query || query.length < minChars) {
            $('.show_result_search').removeClass('open').hide();
            return;
        }
        
        // Show loading state
        resultsList.html('<li class="searching"><i class="fas fa-spinner fa-spin"></i> Đang tìm...</li>');
        $('.show_result_search').addClass('open').show();
        
        searchTimeout = setTimeout(() => {
            $.ajax({
                url: '/api/search',
                method: 'GET',
                data: { q: query },
                success: function(response) {
                    if (response.results && response.results.length > 0) {
                        let html = '';
                        response.results.forEach(item => {
                            html += `
                                <li>
                                    <a href="/truyen-tranh/${item.slug}/">
                                        <div class="search_avatar">
                                            <img src="${item.thumbnail}" alt="${item.title}" style="width: 70px; height: 85px; object-fit: cover;">
                                        </div>
                                        <div class="search_info">
                                            <p class="name">${item.title}</p>
                                            <p class="name_other">${item.sub_title || ''}</p>
                                            <p>Chapter ${parseInt(item.latest_chapter)}</p>
                                        </div>
                                    </a>
                                </li>
                            `;
                        });
                        resultsList.html(html);
                    } else {
                        resultsList.html('<li class="no-result"><div class="search_info"><p>Không tìm thấy kết quả</p></div></li>');
                    }
                },
                error: function(xhr) {
                    console.error('Search error:', xhr);
                    resultsList.html('<li class="error"><div class="search_info"><p>Có lỗi xảy ra khi tìm kiếm</p></div></li>');
                }
            });
        }, debounceTime);
    });

    // Handle keyboard navigation
    $(document).on('keydown', '#search_input', function(e) {
        const key = e.keyCode;
        if (key === 38 || key === 40) { // Up or Down arrow
            e.preventDefault();
            const current = $('.show_result_search li.active');
            const items = $('.show_result_search li');
            
            if (!current.length) {
                items.first().addClass('active');
            } else {
                current.removeClass('active');
                if (key === 38) { // Up
                    current.prev().addClass('active');
                } else { // Down
                    current.next().addClass('active');
                }
            }
        }
    });

    // Close results when clicking outside
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.box_search_main').length) {
            $('.show_result_search').removeClass('open').hide();
        }
    });
});