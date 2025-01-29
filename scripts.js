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



























// JavaScript
document.addEventListener('DOMContentLoaded', function() {
  const featureSlider = document.querySelector('.feature-slider');
  const featureLightbox = document.querySelector('.feature-lightbox');
  const featureClose = document.querySelector('.feature-close');
  const featurePrev = document.querySelector('.feature-prev');
  const featureNext = document.querySelector('.feature-next');
  let featureCurrentIndex = 0;

  // Generate slider images
  for (let i = 1; i <= 17; i++) {
    const img = document.createElement('img');
    img.src = `feature-img/feature-${i}.jpg`;
    img.alt = `Project ${i}`;
    img.dataset.index = i - 1;
    img.dataset.title = `Project ${i}`;
    img.dataset.desc = `Description for Project ${i}`;
    img.addEventListener('click', openLightbox);
    featureSlider.appendChild(img);
  }

  // Lightbox controls
  function openLightbox(e) {
    featureCurrentIndex = parseInt(e.target.dataset.index);
    updateLightbox();
    featureLightbox.style.display = 'block';
  }

  function updateLightbox() {
    const img = document.querySelectorAll('.feature-slider img')[featureCurrentIndex];
    featureLightbox.querySelector('.feature-lightbox-img').src = img.src;
    featureLightbox.querySelector('.feature-lightbox-title').textContent = img.dataset.title;
    featureLightbox.querySelector('.feature-lightbox-desc').textContent = img.dataset.desc;
  }

  function closeLightbox() {
    featureLightbox.style.display = 'none';
  }

  function navigate(direction) {
    featureCurrentIndex += direction;
    if (featureCurrentIndex < 0) featureCurrentIndex = 16;
    if (featureCurrentIndex > 16) featureCurrentIndex = 0;
    updateLightbox();
  }

  // Event listeners
  featureClose.addEventListener('click', closeLightbox);
  featureLightbox.addEventListener('click', function(e) {
    if (e.target === featureLightbox) closeLightbox();
  });

  document.querySelector('.feature-lightbox-prev').addEventListener('click', () => navigate(-1));
  document.querySelector('.feature-lightbox-next').addEventListener('click', () => navigate(1));
  featurePrev.addEventListener('click', () => featureSlider.scrollBy(-300, 0));
  featureNext.addEventListener('click', () => featureSlider.scrollBy(300, 0));

  // Keyboard controls
  document.addEventListener('keydown', (e) => {
    if (featureLightbox.style.display === 'block') {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    }
  });

  // Touch swipe for mobile
  let touchStartX = 0;
  featureLightbox.addEventListener('touchstart', (e) => touchStartX = e.changedTouches[0].screenX);
  featureLightbox.addEventListener('touchend', (e) => {
    const delta = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(delta) > 50) navigate(delta > 0 ? 1 : -1);
  });
});


