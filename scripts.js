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