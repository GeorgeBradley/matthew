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
  const featureSlider = document.querySelector('.feature-slider');
  const featureLightbox = document.querySelector('.feature-lightbox');
  const featureClose = document.querySelector('.feature-close');
  const featurePrev = document.querySelector('.feature-prev');
  const featureNext = document.querySelector('.feature-next');
  let featureCurrentIndex = 0;
  const images = [];
  let imageWidth = 300; // Initial width, can be adjusted
  let scrolling = false;

  // Generate slider images with lazy loading
  for (let i = 1; i <= 17; i++) {
    const img = document.createElement('img');
    img.src = `feature-img/placeholder.jpg`; // Use a placeholder initially
    img.dataset.src = `feature-img/feature-${i}.jpg`; // Real source for lazy loading
    img.alt = `Project ${i}`;
    img.dataset.index = i - 1;
    img.dataset.title = `Project ${i}`;
    img.dataset.desc = `Description for Project ${i}`;
    img.loading = 'lazy'; // For supported browsers
    img.addEventListener('click', openLightbox);
    img.addEventListener('load', function() {
      this.style.opacity = 1; // Fade in when loaded
    });
    img.style.opacity = 0; // Start invisible
    img.style.width = `${imageWidth}px`; // Set initial width
    featureSlider.appendChild(img);
    images.push(img);
  }

  // Lightbox controls
  function openLightbox(e) {
    featureCurrentIndex = parseInt(e.target.dataset.index);
    updateLightbox();
    featureLightbox.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Disable background scrolling
  }

  function updateLightbox() {
    const img = images[featureCurrentIndex];
    featureLightbox.querySelector('.feature-lightbox-img').src = img.dataset.src;
    featureLightbox.querySelector('.feature-lightbox-title').textContent = img.dataset.title;
    featureLightbox.querySelector('.feature-lightbox-desc').textContent = img.dataset.desc;
  }

  function closeLightbox() {
    featureLightbox.style.display = 'none';
    document.body.style.overflow = ''; // Re-enable scrolling
  }

  // Adjust slider position when user stops scrolling
  featureSlider.addEventListener('scroll', function() {
    scrolling = true;
  });

  featureSlider.addEventListener('scrollend', function() {
    scrolling = false;
    const scrollPosition = featureSlider.scrollLeft;
    const nearestIndex = Math.round(scrollPosition / imageWidth);
    featureSlider.scrollTo({
      left: nearestIndex * imageWidth,
      behavior: 'smooth'
    });
    featureCurrentIndex = nearestIndex % images.length;
  });

  // If 'scrollend' is not supported, fallback to a timeout
  if (!('onscrollend' in document.createElement('div'))) {
    let scrollTimeout;
    featureSlider.addEventListener('scroll', function() {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (scrolling) {
          scrolling = false;
          const scrollPosition = featureSlider.scrollLeft;
          const nearestIndex = Math.round(scrollPosition / imageWidth);
          featureSlider.scrollTo({
            left: nearestIndex * imageWidth,
            behavior: 'smooth'
          });
          featureCurrentIndex = nearestIndex % images.length;
        }
      }, 200);
    });
  }

  function navigateSlider(direction) {
    featureCurrentIndex = (featureCurrentIndex + direction + images.length) % images.length;
    featureSlider.scrollTo({
      left: featureCurrentIndex * imageWidth,
      behavior: 'smooth'
    });
  }

  // Event listeners for navigation
  featurePrev.addEventListener('click', () => {
    if (!scrolling) navigateSlider(-1);
  });
  featureNext.addEventListener('click', () => {
    if (!scrolling) navigateSlider(1);
  });

  document.querySelector('.feature-lightbox-prev').addEventListener('click', () => {
    if (!scrolling) {
      featureCurrentIndex = (featureCurrentIndex - 1 + images.length) % images.length;
      updateLightbox();
    }
  });
  document.querySelector('.feature-lightbox-next').addEventListener('click', () => {
    if (!scrolling) {
      featureCurrentIndex = (featureCurrentIndex + 1) % images.length;
      updateLightbox();
    }
  });

  // Close button functionality
  featureClose.addEventListener('click', closeLightbox);
  featureLightbox.addEventListener('click', function(e) {
    if (e.target === featureLightbox) closeLightbox();
  });

  // Keyboard controls
  document.addEventListener('keydown', (e) => {
    if (featureLightbox.style.display === 'block' && !scrolling) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') {
        featureCurrentIndex = (featureCurrentIndex - 1 + images.length) % images.length;
        updateLightbox();
      }
      if (e.key === 'ArrowRight') {
        featureCurrentIndex = (featureCurrentIndex + 1) % images.length;
        updateLightbox();
      }
    }
  });

  // Touch swipe for mobile
  let touchStartX = 0;
  let touchMoveX = 0;

  featureSlider.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchMoveX = 0;
  });

  featureSlider.addEventListener('touchmove', (e) => {
    touchMoveX = e.touches[0].clientX;
    e.preventDefault(); // Prevent scrolling while swiping
  });

  featureSlider.addEventListener('touchend', () => {
    const delta = touchStartX - touchMoveX;
    if (Math.abs(delta) > 50) {
      navigateSlider(delta > 0 ? 1 : -1);
    }
  });

  featureLightbox.addEventListener('touchstart', (e) => touchStartX = e.changedTouches[0].screenX);
  featureLightbox.addEventListener('touchend', (e) => {
    if (!scrolling) {
      const delta = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(delta) > 50) {
        featureCurrentIndex = (featureCurrentIndex + (delta > 0 ? 1 : -1) + images.length) % images.length;
        updateLightbox();
      }
    }
  });

  // Lazy load images
  function lazyLoadImages() {
    images.forEach(img => {
      if (img.getBoundingClientRect().top < window.innerHeight && img.src !== img.dataset.src) {
        img.src = img.dataset.src;
      }
    });
  }

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  const debouncedLazyLoad = debounce(lazyLoadImages, 100);
  window.addEventListener('scroll', debouncedLazyLoad);
  lazyLoadImages(); // Initial check for images in viewport

  // Update image width on resize
  function updateImageWidth() {
    const containerWidth = featureSlider.parentElement.clientWidth;
    const itemsPerView = Math.floor(containerWidth / imageWidth);
    imageWidth = containerWidth / Math.min(itemsPerView, images.length);
    images.forEach(img => {
      img.style.width = `${imageWidth}px`;
    });
  }

  window.addEventListener('resize', updateImageWidth);
  updateImageWidth(); // Call on initial load

  // Accessibility enhancements
  featurePrev.setAttribute('aria-label', 'Previous image');
  featureNext.setAttribute('aria-label', 'Next image');
  featureClose.setAttribute('aria-label', 'Close lightbox');
});