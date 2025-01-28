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


















document.addEventListener('DOMContentLoaded', () => {
    const showcaseCarouselTrack = document.querySelector('.showcase-showcase-carousel-track');
    const showcaseTotalItems = 20;
    let showcaseCurrentSlide = 0;

    // Generate carousel items
    for(let i = 1; i <= showcaseTotalItems; i++) {
        const item = document.createElement('div');
        item.className = 'showcase-showcase-carousel-item';
        item.innerHTML = `
            <img src="feature-img/feature-${i}.jpg" alt="Project ${i}" data-index="${i}">
            <div class="project-number">${String(i).padStart(2, '0')}</div>
        `;
        showcaseCarouselTrack.appendChild(item);
    }

    // Set initial active slide
    document.querySelectorAll('.showcase-showcase-carousel-item')[0].classList.add('active');

    // Navigation handlers
    document.querySelector('.showcase-showcase-carousel-prev').addEventListener('click', () => {
        showcaseCurrentSlide = (showcaseCurrentSlide > 0) ? showcaseCurrentSlide - 1 : showcaseTotalItems - 1;
        showcaseUpdateCarousel();
    });

    document.querySelector('.showcase-showcase-carousel-next').addEventListener('click', () => {
        showcaseCurrentSlide = (showcaseCurrentSlide < showcaseTotalItems - 1) ? showcaseCurrentSlide + 1 : 0;
        showcaseUpdateCarousel();
    });

    function showcaseUpdateCarousel() {
        const items = document.querySelectorAll('.showcase-showcase-carousel-item');
        const offset = -showcaseCurrentSlide * (items[0].offsetWidth + 20);
        showcaseCarouselTrack.style.transform = `translateX(${offset}px)`;
        
        items.forEach((item, index) => {
            item.classList.toggle('active', index === showcaseCurrentSlide);
        });
    }

    // Lightbox functionality
    const showcaseLightbox = document.querySelector('.showcase-showcase-lightbox');
    const showcaseLightboxSlider = document.querySelector('.showcase-showcase-lightbox-slider');
    const showcaseLightboxCounter = document.querySelector('.showcase-showcase-lightbox-counter');

    // Generate lightbox items
    for(let i = 1; i <= showcaseTotalItems; i++) {
        const item = document.createElement('div');
        item.className = 'showcase-showcase-lightbox-item';
        item.innerHTML = `<img src="feature-img/feature-${i}.jpg" alt="Project ${i}">`;
        showcaseLightboxSlider.appendChild(item);
    }

    document.querySelectorAll('.showcase-showcase-carousel-item').forEach((item, index) => {
        item.addEventListener('click', () => {
            showcaseLightbox.style.display = 'block';
            showcaseCurrentSlide = index;
            showcaseUpdateLightbox();
        });
    });

    document.querySelector('.showcase-showcase-lightbox-close').addEventListener('click', (event) => {
        event.stopPropagation();
        showcaseLightbox.style.display = 'none';
    });

    // Lightbox navigation
    document.addEventListener('keydown', (e) => {
        if(showcaseLightbox.style.display === 'block') {
            if(e.key === 'ArrowLeft') showcaseNavigateLightbox(-1);
            if(e.key === 'ArrowRight') showcaseNavigateLightbox(1);
            if(e.key === 'Escape') showcaseLightbox.style.display = 'none';
        }
    });

    function showcaseNavigateLightbox(direction) {
        showcaseCurrentSlide = (showcaseCurrentSlide + direction + showcaseTotalItems) % showcaseTotalItems;
        showcaseUpdateLightbox();
    }

    function showcaseUpdateLightbox() {
        document.querySelectorAll('.showcase-showcase-lightbox-item').forEach((item, index) => {
            item.classList.toggle('active', index === showcaseCurrentSlide);
        });
        showcaseLightboxCounter.textContent = `${showcaseCurrentSlide + 1} / ${showcaseTotalItems}`;
    }

    // Swipe detection for mobile
    let showcaseTouchStartX = 0;
    let showcaseTouchEndX = 0;

    showcaseLightboxSlider.addEventListener('touchstart', e => {
        showcaseTouchStartX = e.changedTouches[0].screenX;
    });

    showcaseLightboxSlider.addEventListener('touchend', e => {
        showcaseTouchEndX = e.changedTouches[0].screenX;
        if(showcaseTouchStartX - showcaseTouchEndX > 50) showcaseNavigateLightbox(1);
        if(showcaseTouchEndX - showcaseTouchStartX > 50) showcaseNavigateLightbox(-1);
    });
});