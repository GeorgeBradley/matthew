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
















document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.slider-track');
    const slides = Array.from(track.children);
    const totalSlides = slides.length;
    let currentIndex = 0;
    
    // Clone all slides and append for seamless looping
    const clones = slides.map(slide => slide.cloneNode(true));
    track.append(...clones);

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        
        const moveAmount = -currentIndex * 100;
        track.style.transition = 'transform 1.5s ease-in-out';
        track.style.transform = `translateX(${moveAmount}%)`;
        
        // Reset position when reaching cloned slides
        if (currentIndex === totalSlides - 1) {
            setTimeout(() => {
                track.style.transition = 'none';
                track.style.transform = 'translateX(0)';
                currentIndex = -1;
                void track.offsetWidth; // Trigger reflow
            }, 1500);
        }
    }

    // Start auto-slide
    setInterval(nextSlide, 3000); // Adjust timing here (3000 = 3 seconds)

    
    // Modal functionality
    const modal = document.getElementById('imageModal');
    const modalImage = modal.querySelector('.modal-image');
    const modalCaption = document.getElementById('modalCaption');
    const seeMoreLink = document.getElementById('seeMoreLink');

    // Open modal on image click
    document.querySelectorAll('.slider-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const img = item.querySelector('img');
            modal.style.display = 'block';
            modalImage.src = img.src;
            modalCaption.textContent = item.dataset.caption || img.alt;
            seeMoreLink.href = item.dataset.link || '#';
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Close handlers
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.closest('.close-modal')) {
            closeModal();
        }
    });

    // ESC key close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
});



















// Initialize Carousel
const carouselTrack = document.querySelector('.showcase-carousel-track');
const totalItems = 20;
let currentSlide = 0;

// Generate carousel items
for(let i = 1; i <= totalItems; i++) {
    const item = document.createElement('div');
    item.className = 'showcase-carousel-item';
    item.innerHTML = `
        <img src="feature-img/feature-${i}.jpg" alt="Project ${i}" data-index="${i}">
        <div class="project-number">${String(i).padStart(2, '0')}</div>
    `;
    carouselTrack.appendChild(item);
}

// Set initial active slide
document.querySelectorAll('.showcase-carousel-item')[0].classList.add('active');

// Navigation handlers
document.querySelector('.showcase-carousel-prev').addEventListener('click', () => {
    currentSlide = (currentSlide > 0) ? currentSlide - 1 : totalItems - 1;
    updateCarousel();
});

document.querySelector('.showcase-carousel-next').addEventListener('click', () => {
    currentSlide = (currentSlide < totalItems - 1) ? currentSlide + 1 : 0;
    updateCarousel();
});

function updateCarousel() {
    const items = document.querySelectorAll('.showcase-carousel-item');
    const offset = -currentSlide * (items[0].offsetWidth + 20);
    carouselTrack.style.transform = `translateX(${offset}px)`;
    
    items.forEach((item, index) => {
        item.classList.toggle('active', index === currentSlide);
    });
}

// Lightbox functionality
const lightbox = document.querySelector('.showcase-lightbox');
const lightboxSlider = document.querySelector('.showcase-lightbox-slider');
const lightboxCounter = document.querySelector('.showcase-lightbox-counter');
const closeButton = document.querySelector('.showcase-lightbox-close');

// Generate lightbox items
for(let i = 1; i <= totalItems; i++) {
    const item = document.createElement('div');
    item.className = 'showcase-lightbox-item';
    item.innerHTML = `<img src="feature-img/feature-${i}.jpg" alt="Project ${i}">`;
    lightboxSlider.appendChild(item);
}

document.querySelectorAll('.showcase-carousel-item').forEach((item, index) => {
    item.addEventListener('click', () => {
        lightbox.style.display = 'block';
        currentSlide = index;
        updateLightbox();
    });
});

// Close modal function
function closeModal() {
    lightbox.style.display = 'none';
}

// Enhanced close functionality
closeButton.addEventListener('click', (event) => {
    event.preventDefault(); // Prevents default action if any
    event.stopPropagation(); // Prevents event from bubbling up
    closeModal();
    console.log('Close button clicked'); // For debugging
});

// Close modal by clicking outside
document.addEventListener('click', (e) => {
    if (!lightbox.contains(e.target) && lightbox.style.display === 'block') {
        closeModal();
    }
});

// Lightbox navigation
document.addEventListener('keydown', (e) => {
    if(lightbox.style.display === 'block') {
        if(e.key === 'ArrowLeft') navigateLightbox(-1);
        if(e.key === 'ArrowRight') navigateLightbox(1);
        if(e.key === 'Escape') {
            closeModal();
            console.log("Escape key pressed to close modal"); // For debugging
        }
    }
});

function navigateLightbox(direction) {
    currentSlide = (currentSlide + direction + totalItems) % totalItems;
    updateLightbox();
}

function updateLightbox() {
    document.querySelectorAll('.showcase-lightbox-item').forEach((item, index) => {
        item.classList.toggle('active', index === currentSlide);
    });
    lightboxCounter.textContent = `${currentSlide + 1} / ${totalItems}`;
}

// Swipe detection for mobile
let touchStartX = 0;
let touchEndX = 0;

lightboxSlider.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

lightboxSlider.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    if(touchStartX - touchEndX > 50) navigateLightbox(1);
    if(touchEndX - touchStartX > 50) navigateLightbox(-1);
});
