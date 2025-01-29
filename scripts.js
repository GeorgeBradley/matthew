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
    const featureGallery = document.querySelector('#feature-gallery .feature-slider');
    let featureCurrentIndex = 0;
    let featureImages = [];

    // Generate images dynamically
    for (let i = 1; i <= 17; i++) {
        let featureImg = document.createElement('img');
        featureImg.src = `feature-img/feature-${i}.jpg`;
        featureImg.alt = `Project ${i}`;
        featureImg.dataset.lightbox = 'gallery';
        featureImg.dataset.title = `Project ${i}`;
        featureImg.style.display = 'none'; // Initially hide all images
        featureImages.push(featureImg);
        featureGallery.appendChild(featureImg);
    }

    // Show the first image
    if (featureImages.length > 0) {
        featureImages[0].style.display = 'block';
    }

    // Function to switch images
    function featureSwitchImage(direction) {
        featureImages[featureCurrentIndex].style.display = 'none';
        if (direction === 'next') {
            featureCurrentIndex = (featureCurrentIndex + 1) % featureImages.length;
        } else {
            featureCurrentIndex = (featureCurrentIndex - 1 + featureImages.length) % featureImages.length;
        }
        featureImages[featureCurrentIndex].style.display = 'block';
    }

    // Event listeners for swipe functionality
    let featureStartX, featureMoveX;
    featureGallery.addEventListener('touchstart', function(e) {
        featureStartX = e.touches[0].clientX;
    });

    featureGallery.addEventListener('touchmove', function(e) {
        featureMoveX = e.touches[0].clientX;
    });

    featureGallery.addEventListener('touchend', function(e) {
        if (featureStartX - featureMoveX > 50) { // Swipe left
            featureSwitchImage('next');
        } else if (featureMoveX - featureStartX > 50) { // Swipe right
            featureSwitchImage('prev');
        }
    });

    // Click to open Lightbox
    featureGallery.addEventListener('click', function(e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            e.target.click(); // This will trigger Lightbox to open
        }
    });
});

  
