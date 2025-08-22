document.addEventListener('DOMContentLoaded', function () {
    const previousButton = document.querySelector('.btn-previous');
    const nextButton = document.querySelector('.btn-next');

    if (previousButton) {
        previousButton.addEventListener('click', function (event) {
            event.preventDefault();
            window.location.href = previousButton.getAttribute('href');
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', function (event) {
            event.preventDefault();
            window.location.href = nextButton.getAttribute('href');
        });
    }

    const searchInput = document.querySelector('input[name="query"]');
    const searchResults = document.querySelector('#search-results');

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = searchInput.value;

            if (query.length > 2) {
                fetch(`/search?query=${query}`)
                    .then(response => response.json())
                    .then(data => {
                        searchResults.innerHTML = '';
                        data.forEach(comic => {
                            const comicItem = document.createElement('div');
                            comicItem.classList.add('comic-item');
                            comicItem.innerHTML = `
                                <div class="card h-100">
                                    <div class="card-img-container">
                                        <img src="${comic.thumbnail}" class="card-img-top" alt="${comic.title}" title=" Đọc truyện ${comic.title}">
                                    </div>
                                    <div class="card-body p-2">
                                        <h5 class="card-title">
                                            <a href="/truyen-tranh/${comic.slug}.html" title=" Đọc truyện ${comic.title}">${comic.title}</a>
                                        </h5>
                                    </div>
                                </div>
                            `;
                            searchResults.appendChild(comicItem);
                        });
                    });
            } else {
                searchResults.innerHTML = '';
            }
        });
    }
});