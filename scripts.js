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






const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links a');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

navItems.forEach(item => {
    item.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Smooth scroll for navigation items
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
































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




























































const SLIDES = 17;
let currentSlide = 0;
let autoSlideInterval;

const sliderTrack = document.querySelector('.slider-track');
const dotsContainer = document.querySelector('.slider-controls');

// Generate slides
for (let i = 1; i <= SLIDES; i++) {
    const slide = document.createElement('div');
    slide.className = 'slide';
    slide.innerHTML = `
        <img src="feature-img/feature-${i}.jpg" 
             alt="Featured Image ${i}" 
             loading="${i <= 3 ? 'eager' : 'lazy'}">
    `;
    sliderTrack.appendChild(slide);

    const dot = document.createElement('button');
    dot.className = 'slider-dot';
    dot.addEventListener('click', () => goToSlide(i - 1));
    dotsContainer.appendChild(dot);
}

const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.slider-dot');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

slides[currentSlide].classList.add('active');
dots[currentSlide].classList.add('active');

function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 3000);
}

function nextSlide() { goToSlide((currentSlide + 1) % SLIDES); }
function prevSlide() { goToSlide((currentSlide - 1 + SLIDES) % SLIDES); }

function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

// Event listeners
prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);

// Touch support
let touchStartX = 0;
sliderTrack.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
}, { passive: true });

sliderTrack.addEventListener('touchend', e => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 30) diff > 0 ? nextSlide() : prevSlide();
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
});

startAutoSlide();

// Preload first few images
window.addEventListener('load', () => {
    for (let i = 1; i <= Math.min(4, SLIDES); i++) {
        new Image().src = `feature-img/feature-${i}.jpg`;
    }
});

























 // Immediately-invoked function to ensure DOM readiness
        (function initHeroGallery() {
            const gallery = document.querySelector('.hero-gallery');
            const totalImages = 17;

            // Clear existing content (just in case)
            gallery.innerHTML = '';

            // Create document fragment for batch insertion
            const fragment = document.createDocumentFragment();

            for (let i = 1; i <= totalImages; i++) {
                const imgLink = document.createElement('a');
                imgLink.href = `feature-img/feature-${i}.jpg`;
                imgLink.setAttribute('data-lightbox', 'hero-gallery');
                imgLink.setAttribute('data-title`, `Image ${i}`);

                const img = document.createElement('img');
                img.src = `feature-img/feature-${i}.jpg`;
                img.className = 'hero-image';
                img.alt = `Feature Image ${i}`;
                
                imgLink.appendChild(img);
                fragment.appendChild(imgLink);
            }

            // Add all elements to DOM at once
            gallery.appendChild(fragment);

            // Initialize lightbox after DOM insertion
            new SimpleLightbox('.hero-gallery a', {
                captionsData: 'data-title',
                captionDelay: 200
            });

            console.log(`Injected ${totalImages} hero images successfully!`);
        })();



