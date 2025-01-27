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




















// Generate showcase grid items
const showcaseGrid = document.querySelector('.showcase-grid');
const totalShowcaseImages = 20;

for (let i = 1; i <= totalShowcaseImages; i++) {
    const gridItem = document.createElement('div');
    gridItem.className = 'showcase-grid-item';
    gridItem.innerHTML = `
        <img src="feature-img/feature${i}.jpg" alt="Project ${i}" data-index="${i}">
    `;
    showcaseGrid.appendChild(gridItem);
}

// Showcase Lightbox functionality
const showcaseLightbox = document.getElementById('showcaseLightbox');
const showcaseExpandedImg = document.getElementById('showcaseExpandedImg');
const showcaseClose = document.querySelector('.showcase-close');
const showcaseCounter = document.querySelector('.showcase-image-counter');
let currentShowcaseIndex = 1;

document.querySelectorAll('.showcase-grid-item img').forEach(img => {
    img.addEventListener('click', function() {
        showcaseLightbox.style.display = 'block';
        currentShowcaseIndex = parseInt(this.dataset.index);
        updateShowcaseImage(currentShowcaseIndex);
    });
});

showcaseClose.onclick = function() {
    showcaseLightbox.style.display = 'none';
};

window.onclick = function(event) {
    if (event.target === showcaseLightbox) {
        showcaseLightbox.style.display = 'none';
    }
};

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (showcaseLightbox.style.display === 'block') {
        if (e.key === 'ArrowRight') {
            currentShowcaseIndex = currentShowcaseIndex < totalShowcaseImages ? currentShowcaseIndex + 1 : 1;
            updateShowcaseImage(currentShowcaseIndex);
        } else if (e.key === 'ArrowLeft') {
            currentShowcaseIndex = currentShowcaseIndex > 1 ? currentShowcaseIndex - 1 : totalShowcaseImages;
            updateShowcaseImage(currentShowcaseIndex);
        } else if (e.key === 'Escape') {
            showcaseLightbox.style.display = 'none';
        }
    }
});

function updateShowcaseImage(index) {
    showcaseExpandedImg.src = `feature-img/feature${index}.jpg`;
    showcaseCounter.textContent = `${index} / ${totalShowcaseImages}`;
    showcaseExpandedImg.style.animation = 'none';
    void showcaseExpandedImg.offsetWidth; // Trigger reflow
    showcaseExpandedImg.style.animation = 'showcaseFadeIn 0.3s ease';
}




