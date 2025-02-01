// Document Ready
document.addEventListener('DOMContentLoaded', () => {
    // Core functionality initialization
    initAccessibility();
    setupServiceWorker();
});

// Accessibility Features
function initAccessibility() {
    // Add aria-current to current page navigation
    const currentPath = window.location.pathname;
    document.querySelectorAll('nav a').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.setAttribute('aria-current', 'page');
        }
    });
}

// Service Worker Registration
function setupServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('ServiceWorker registration successful');
                })
                .catch(err => {
                    console.log('ServiceWorker registration failed: ', err);
                });
        });
    }
}

// Performance Monitoring
window.addEventListener('load', () => {
    const timing = window.performance.timing;
    const loadTime = timing.loadEventEnd - timing.navigationStart;
    console.log(`Page loaded in ${loadTime}ms`);
});

// Error Handling
window.onerror = function(message, source, lineno, colno, error) {
    console.error(`Error: ${message} at ${source}:${lineno}:${colno}`);
    return true;
};






































document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('feature-slider');
    const lightbox = document.getElementById('feature-lightbox');
    const modalImg = document.getElementById('feature-img-modal');
    const captionText = document.getElementById('feature-caption');
    const closeBtn = document.getElementsByClassName('feature-close')[0];
    let currentIndex = 0;
    const images = [];
    const prevButton = document.getElementById('feature-prev');
    const nextButton = document.getElementById('feature-next');
    let autoSlide;

    // Dynamically add images to slider with lazy loading
    for (let i = 1; i <= 17; i++) {
        let img = document.createElement('img');
        img.src = `data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7`; // Placeholder for lazy loading
        img.dataset.src = `feature-img/feature-${i}.jpg`;
        img.alt = `Work ${i}`;
        img.title = `Work ${i}`;
        img.loading = "lazy";
        img.addEventListener('click', function() {
            openLightbox(this.dataset.src, this.alt);
        });
        slider.appendChild(img);
        images.push(img);
    }

    function loadImage(img) {
        const src = img.dataset.src;
        if (!src) return;
        img.src = src;
        img.removeAttribute('data-src');
    }

    // Implement lazy loading
    function handleLazyLoad() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        images.forEach(img => {
            if (img.getBoundingClientRect().top < window.innerHeight && img.dataset.src) {
                loadImage(img);
            }
        });
    }

    window.addEventListener('scroll', handleLazyLoad);
    handleLazyLoad(); // Load images on initial load

    function openLightbox(src, alt) {
        modalImg.src = src;
        modalImg.alt = alt; // For accessibility
        captionText.innerHTML = alt;
        lightbox.style.display = "block";
    }

    closeBtn.onclick = function() { 
        lightbox.style.display = "none";
    }

    // Close lightbox if clicked outside of image
    window.onclick = function(event) {
        if (event.target == lightbox) {
            lightbox.style.display = "none";
        }
    }

    // Navigation for the slider
    function slideTo(index) {
        currentIndex = (index + images.length) % images.length;
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    prevButton.addEventListener('click', () => slideTo(currentIndex - 1));
    nextButton.addEventListener('click', () => slideTo(currentIndex + 1));

    // Keyboard navigation
    document.addEventListener('keydown', function(event) {
        if (lightbox.style.display === "block") {
            if (event.key === "Escape") lightbox.style.display = "none";
        } else {
            if (event.key === "ArrowLeft") slideTo(currentIndex - 1);
            if (event.key === "ArrowRight") slideTo(currentIndex + 1);
        }
    });

    // Automatic slide every 3 seconds
    function autoSlideFunction() {
        slideTo(currentIndex + 1);
    }

    function startSlide() {
        autoSlide = setInterval(autoSlideFunction, 3000);
    }

    function stopSlide() {
        clearInterval(autoSlide);
    }

    slider.addEventListener('mouseenter', stopSlide);
    slider.addEventListener('mouseleave', startSlide);

    startSlide(); // Start the slideshow when the page loads
});
  









document.getElementById('current-year').textContent = new Date().getFullYear();























































































        class HeroSlider {
            constructor() {
                this.API_URL = 'https://GeorgeBradley.github.io/matthew/feature-project.json';
                this.currentIndex = 0;
                this.intervalTime = 5000;
                this.intervalId = null;
                this.touchStartX = 0;
                this.touchEndX = 0;
                this.init();
            }

            async init() {
                try {
                    await this.loadData();
                    this.createSlides();
                    this.createDots();
                    this.startAutoPlay();
                    this.addEventListeners();
                    document.querySelector('.loading').remove();
                } catch (error) {
                    this.handleError(error);
                }
            }

            async loadData() {
                const response = await fetch(this.API_URL);
                if (!response.ok) throw new Error('Network response was not ok');
                this.projects = await response.json();
            }

            createSlides() {
                const slidesContainer = document.querySelector('.hero-slides');
                this.slides = this.projects.map(project => {
                    const slide = document.createElement('div');
                    slide.className = 'hero-slide';
                    
                    const img = new Image();
                    img.src = project['feature-project-thumbnail'];
                    img.alt = project['feature-project-name'];
                    img.loading = 'eager';
                    
                    const progress = document.createElement('div');
                    progress.className = 'progress-bar';
                    
                    const content = document.createElement('div');
                    content.className = 'hero-content';
                    
                    const text = document.createElement('div');
                    text.className = 'hero-text';
                    
                    const title = document.createElement('h1');
                    title.className = 'hero-title';
                    title.textContent = project['feature-project-name'];
                    
                    const description = document.createElement('p');
                    description.className = 'hero-description';
                    description.textContent = project['feature-project-description'];
                    
                    text.append(title, description);
                    content.appendChild(text);
                    slide.append(img, progress, content);
                    slidesContainer.appendChild(slide);
                    return slide;
                });
                this.slides[0].classList.add('active');
            }

            createDots() {
                const dotsContainer = document.querySelector('.hero-dots');
                this.dots = this.projects.map((_, index) => {
                    const dot = document.createElement('button');
                    dot.className = 'hero-dot';
                    dot.ariaLabel = `Go to slide ${index + 1}`;
                    dot.addEventListener('click', () => this.goToSlide(index));
                    dotsContainer.appendChild(dot);
                    return dot;
                });
                this.dots[0].classList.add('active');
            }

            goToSlide(index) {
                if (index === this.currentIndex) return;
                
                this.slides[this.currentIndex].classList.remove('active');
                this.dots[this.currentIndex].classList.remove('active');
                
                this.currentIndex = index;
                
                this.slides[this.currentIndex].classList.add('active');
                this.dots[this.currentIndex].classList.add('active');
                
                this.resetAutoPlay();
            }

            nextSlide() {
                const nextIndex = (this.currentIndex + 1) % this.slides.length;
                this.goToSlide(nextIndex);
            }

            startAutoPlay() {
                this.intervalId = setInterval(() => this.nextSlide(), this.intervalTime);
            }

            resetAutoPlay() {
                clearInterval(this.intervalId);
                this.startAutoPlay();
            }

            handleTouchStart(e) {
                this.touchStartX = e.changedTouches[0].screenX;
            }

            handleTouchEnd(e) {
                this.touchEndX = e.changedTouches[0].screenX;
                const diff = this.touchStartX - this.touchEndX;
                if (Math.abs(diff) > 50) {
                    diff > 0 ? this.nextSlide() : this.prevSlide();
                }
            }

            addEventListeners() {
                // Touch events
                document.querySelector('.hero-container').addEventListener('touchstart', e => this.handleTouchStart(e));
                document.querySelector('.hero-container').addEventListener('touchend', e => this.handleTouchEnd(e));
                
                // Keyboard navigation
                document.addEventListener('keydown', e => {
                    if (e.key === 'ArrowLeft') this.prevSlide();
                    if (e.key === 'ArrowRight') this.nextSlide();
                });
            }

            prevSlide() {
                const prevIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
                this.goToSlide(prevIndex);
            }

            handleError(error) {
                console.error('Error:', error);
                const loading = document.querySelector('.loading');
                loading.innerHTML = `
                    <div style="text-align: center">
                        <p>⚠️ Failed to load content</p>
                        <button onclick="location.reload()" 
                                style="margin-top: 1rem; padding: 0.5rem 1rem; background: white; border: none; border-radius: 4px; cursor: pointer">
                            Retry
                        </button>
                    </div>
                `;
            }
        }

        // Initialize slider
        new HeroSlider();
