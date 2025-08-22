class ChapterViewer {
    constructor(token) {
        // console.log('ChapterViewer initialized with token:', token);
        this.token = token;
        this.loadedImages = new Set();
        this.preloadDistance = 5;
        this.turnstileToken = null;
        this.cachedUrls = null;
        
        // Khởi tạo ngay lập tức
        this.initObserver();
        
        // Tải ảnh ngay lập tức mà không cần đợi Turnstile
        this.loadAllImages();
    }

    setTurnstileToken(token) {
        // console.log('Setting Turnstile token');
        this.turnstileToken = token;
    }

    initObserver() {
        // console.log('Initializing intersection observer');
        const options = {
            root: null,
            rootMargin: '100px',
            threshold: 0.1
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadImage(img);
                    this.observer.unobserve(img);
                }
            });
        }, options);

        // Observe all images
        const images = document.querySelectorAll('.chapter-image');
        // console.log(`Found ${images.length} images to observe`);
        images.forEach(img => {
            this.observer.observe(img);
        });
    }

    loadAllImages() {
        // console.log('Loading all images');
        document.querySelectorAll('.chapter-image').forEach(img => {
            if (!this.loadedImages.has(parseInt(img.dataset.index))) {
                this.loadImage(img);
            }
        });
    }

    decryptUrl(url) {
        return url.replace(
            /QfSv5w|6pALt7|3EpPKX/g,
            match => ({
                'QfSv5w': '.',
                '6pALt7': ':',
                '3EpPKX': '/'
            })[match]
        );
    }

    async loadImage(img) {
        const index = parseInt(img.dataset.index);
        if (this.loadedImages.has(index)) return;

        try {
            // console.log(`Loading image ${index}`);
            // Get the URLs from API
            const urls = await this.fetchImageUrls();
            if (!urls || !urls[index]) {
                // console.error(`Image URL not found for index ${index}`);
                throw new Error('Image URL not found');
            }

            // Decrypt URL
            const decryptedUrl = this.decryptUrl(urls[index]);
            // console.log(`Decrypted URL for image ${index}`);

            // Fetch the image as blob
            // console.log(`Fetching image ${index}`);
            const response = await fetch(decryptedUrl);
            if (!response.ok) {
                throw new Error(`Failed to load image: ${response.status}`);
            }
            
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            // console.log(`Created blob URL for image ${index}`);

            // Set new image source
            img.onload = () => {
                // console.log(`Image ${index} loaded successfully`);
                this.loadedImages.add(index);
                this.preloadNextImages(index);
            };

            img.src = blobUrl;
        } catch (error) {
            // console.error(`Error loading image ${index}:`, error);
            img.src = '/img/loading-error.png';
        }
    }

    async fetchImageUrls() {
        if (!this.token) {
            // console.error('No token provided');
            return [];
        }

        if (this.cachedUrls) {
            return this.cachedUrls;
        }

        try {
            // console.log('Fetching image URLs from API');
            const headers = {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            };
            
            // Thêm Turnstile token nếu có
            if (this.turnstileToken) {
                // console.log('Adding Turnstile token to request');
                headers['CF-Turnstile-Token'] = this.turnstileToken;
            } else {
                // console.log('No Turnstile token available');
            }

            // console.log(`Sending request to /api/chapter-images/${this.token}`);
            const response = await fetch(`/api/chapter-images/${this.token}`, {
                headers: headers
            });

            if (!response.ok) {
                // console.error(`API error: ${response.status}`);
                throw new Error(`API error: ${response.status}`);
            }

            // console.log('Response received, parsing JSON');
            this.cachedUrls = await response.json();
            // console.log(`Received ${this.cachedUrls.length} image URLs`);
            return this.cachedUrls;
        } catch (error) {
            // console.error('Error fetching image URLs:', error);
            return [];
        }
    }

    preloadNextImages(currentIndex) {
        // console.log(`Preloading next ${this.preloadDistance} images after index ${currentIndex}`);
        for (let i = 1; i <= this.preloadDistance; i++) {
            const nextIndex = currentIndex + i;
            const img = document.querySelector(`.chapter-image[data-index="${nextIndex}"]`);
            if (img && !this.loadedImages.has(nextIndex)) {
                this.loadImage(img);
            }
        }
    }
}