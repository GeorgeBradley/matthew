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
        const totalImages = 17;
        const carouselTrack = document.querySelector('.showcase-carousel-track');
        const lightboxSlider = document.querySelector('.showcase-lightbox-slider');
        const dotsContainer = document.querySelector('.showcase-carousel-dots');
        let currentIndex = 0;
        let lightboxIndex = 0;
        let itemWidth;

        // Generate elements
        Array.from({length: totalImages}).forEach((_, i) => {
            const imgNumber = i + 1;

            // Carousel Item
            const carouselItem = document.createElement('div');
            carouselItem.className = 'showcase-carousel-item';
            carouselItem.innerHTML = `
                <img src="feature.img/feature-${imgNumber}.jpg" 
                     alt="Feature ${imgNumber}" 
                     loading="lazy"
                     data-index="${i}">
            `;
            carouselTrack.appendChild(carouselItem);

            // Lightbox Slide
            const lightboxSlide = document.createElement('div');
            lightboxSlide.className = 'showcase-lightbox-slide';
            lightboxSlide.innerHTML = `
                <img src="feature-img/feature-${imgNumber}.jpg" 
                     alt="Feature ${imgNumber}">
            `;
            lightboxSlider.appendChild(lightboxSlide);

            // Navigation Dots
            const dot = document.createElement('div');
            dot.className = 'dot';
            dot.dataset.index = i;
            dotsContainer.appendChild(dot);
        });

        // Initialize variables after DOM creation
        const items = document.querySelectorAll('.showcase-carousel-item');
        const dots = document.querySelectorAll('.dot');
        itemWidth = items[0].offsetWidth + 20; // Include margin

        // Carousel Functions
        function updateCarousel() {
            carouselTrack.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
            dots.forEach(dot => dot.classList.remove('active'));
            dots[currentIndex].classList.add('active');
        }

        // Event Listeners
        document.querySelector('.showcase-carousel-prev').addEventListener('click', () => {
            currentIndex = Math.max(currentIndex - 1, 0);
            updateCarousel();
        });

        document.querySelector('.showcase-carousel-next').addEventListener('click', () => {
            currentIndex = Math.min(currentIndex + 1, totalImages - 1);
            updateCarousel();
        });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
        });

        // Lightbox Functions
        const lightbox = document.querySelector('.showcase-lightbox');

        function openLightbox(index) {
            lightboxIndex = index;
            lightbox.style.display = 'block';
            updateLightbox();
        }

        function updateLightbox() {
            lightboxSlider.style.transform = `translateX(-${lightboxIndex * 100}%)`;
            document.querySelector('.showcase-lightbox-counter').textContent = 
                `${lightboxIndex + 1} / ${totalImages}`;
        }

        document.querySelectorAll('.showcase-carousel-item img').forEach((img, index) => {
            img.addEventListener('click', () => openLightbox(index));
        });

        document.querySelector('.showcase-lightbox-close').addEventListener('click', () => {
            lightbox.style.display = 'none';
        });

        document.querySelector('.showcase-lightbox-prev').addEventListener('click', () => {
            lightboxIndex = Math.max(lightboxIndex - 1, 0);
            updateLightbox();
        });

        document.querySelector('.showcase-lightbox-next').addEventListener('click', () => {
            lightboxIndex = Math.min(lightboxIndex + 1, totalImages - 1);
            updateLightbox();
        });

        // Keyboard Navigation
        document.addEventListener('keydown', (e) => {
            if (lightbox.style.display === 'block') {
                if (e.key === 'Escape') lightbox.style.display = 'none';
                if (e.key === 'ArrowLeft') lightboxIndex = Math.max(lightboxIndex - 1, 0);
                if (e.key === 'ArrowRight') lightboxIndex = Math.min(lightboxIndex + 1, totalImages - 1);
                updateLightbox();
            }
        });

        // Touch Handling
        let touchStartX = 0;
        lightboxSlider.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, false);

        lightboxSlider.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const deltaX = touchStartX - touchEndX;
            
            if (Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    lightboxIndex = Math.min(lightboxIndex + 1, totalImages - 1);
                } else {
                    lightboxIndex = Math.max(lightboxIndex - 1, 0);
                }
                updateLightbox();
            }
        });

        // Responsive Adjustments
        window.addEventListener('resize', () => {
            itemWidth = items[0].offsetWidth + 20;
            updateCarousel();
        });

        // Initial setup
        updateCarousel();
    });