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







// JavaScript
class PremiumNavigation {
    constructor() {
        this.navToggle = document.querySelector('.nav-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.navOverlay = document.querySelector('.nav-overlay');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.header = document.querySelector('.site-header');
        this.lastScrollY = window.scrollY;

        this.init();
    }

    init() {
        // Menu Toggle
        this.navToggle.addEventListener('click', () => this.toggleMenu());
        
        // Close on Overlay Click
        this.navOverlay.addEventListener('click', () => this.closeMenu());
        
        // Smooth Scroll
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeMenu();
                this.scrollToSection(link.hash);
                this.setActiveLink(link);
            });
        });

        // Header Scroll Behavior
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeMenu();
        });

        // Initialize Active Link
        this.setActiveLinkOnScroll();
    }

    toggleMenu() {
        const isExpanded = this.navToggle.getAttribute('aria-expanded') === 'true';
        this.navToggle.setAttribute('aria-expanded', !isExpanded);
        this.navMenu.classList.toggle('active', !isExpanded);
        this.navOverlay.classList.toggle('active', !isExpanded);
        document.body.classList.toggle('nav-active', !isExpanded);
    }

    closeMenu() {
        this.navToggle.setAttribute('aria-expanded', 'false');
        this.navMenu.classList.remove('active');
        this.navOverlay.classList.remove('active');
        document.body.classList.remove('nav-active');
    }

    scrollToSection(target) {
        const element = document.querySelector(target);
        if (element) {
            const headerHeight = document.querySelector('.site-header').offsetHeight;
            const offset = element.offsetTop - headerHeight;
            
            window.scrollTo({
                top: offset,
                behavior: 'smooth'
            });
        }
    }

    setActiveLink(activeLink) {
        this.navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }

    handleScroll() {
        const currentScrollY = window.scrollY;
        
        // Hide header on scroll down
        if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
            this.header.style.transform = 'translateY(-100%)';
        } else {
            this.header.style.transform = 'translateY(0)';
        }
        
        this.lastScrollY = currentScrollY;
        
        // Update active link based on scroll position
        this.setActiveLinkOnScroll();
    }

    setActiveLinkOnScroll() {
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.scrollY + this.header.offsetHeight + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && 
                scrollPosition <= sectionTop + sectionHeight) {
                const targetLink = document.querySelector(`.nav-link[href="#${section.id}"]`);
                if (targetLink) this.setActiveLink(targetLink);
            }
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new PremiumNavigation();
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
});