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
  const imageWidth = 300; // Assuming each image is 300px wide
  let scrolling = false;

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
    featureLightbox.querySelector('.feature-lightbox-img').src = img.src;
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
});