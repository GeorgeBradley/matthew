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
const showcaseTrack = document.getElementById('showcaseTrack');
const totalItems = 20;
let currentAngle = 0;
let currentIndex = 1;

// Create carousel items
for(let i = 1; i <= totalItems; i++) {
    const item = document.createElement('div');
    item.className = 'showcase-item';
    item.innerHTML = `
        <img src="feature-img/feature${i}.jpg" alt="Project ${i}" data-index="${i}">
    `;
    showcaseTrack.appendChild(item);
}

// Position items in circular layout
const items = document.querySelectorAll('.showcase-item');
const radius = 600; // Match perspective distance
const angleStep = 360 / totalItems;

items.forEach((item, index) => {
    const angle = index * angleStep;
    item.style.transform = `
        rotateY(${angle}deg)
        translateZ(${radius}px)
    `;
});

// Navigation handlers
document.querySelector('.showcase-prev').addEventListener('click', () => {
    currentAngle += angleStep;
    showcaseTrack.style.transform = `rotateY(${currentAngle}deg)`;
    currentIndex = currentIndex > 1 ? currentIndex - 1 : totalItems;
});

document.querySelector('.showcase-next').addEventListener('click', () => {
    currentAngle -= angleStep;
    showcaseTrack.style.transform = `rotateY(${currentAngle}deg)`;
    currentIndex = currentIndex < totalItems ? currentIndex + 1 : 1;
});

// Modal functionality
const modal = document.getElementById('showcaseModal');
const modalImg = document.getElementById('showcaseModalImg');
const modalCounter = document.querySelector('.showcase-modal-counter');

items.forEach(item => {
    item.addEventListener('click', function() {
        modal.style.display = 'block';
        currentIndex = parseInt(this.querySelector('img').dataset.index);
        updateModalImage(currentIndex);
    });
});

// Close modal
document.querySelector('.showcase-close-modal').onclick = () => {
    modal.style.display = 'none';
};

// Modal navigation
document.querySelector('.showcase-modal-prev').addEventListener('click', () => {
    currentIndex = currentIndex > 1 ? currentIndex - 1 : totalItems;
    updateModalImage(currentIndex);
});

document.querySelector('.showcase-modal-next').addEventListener('click', () => {
    currentIndex = currentIndex < totalItems ? currentIndex + 1 : 1;
    updateModalImage(currentIndex);
});

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if(modal.style.display === 'block') {
        if(e.key === 'ArrowLeft') {
            currentIndex = currentIndex > 1 ? currentIndex - 1 : totalItems;
            updateModalImage(currentIndex);
        }
        if(e.key === 'ArrowRight') {
            currentIndex = currentIndex < totalItems ? currentIndex + 1 : 1;
            updateModalImage(currentIndex);
        }
        if(e.key === 'Escape') {
            modal.style.display = 'none';
        }
    }
});

function updateModalImage(index) {
    modalImg.src = `feature-img/feature${index}.jpg`;
    modalCounter.textContent = `${index} / ${totalItems}`;
    modalImg.style.animation = 'none';
    void modalImg.offsetWidth; // Trigger reflow
    modalImg.style.animation = 'showcaseZoom 0.3s';
}




