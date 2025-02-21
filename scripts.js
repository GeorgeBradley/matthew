// Consolidated Initialization on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initAccessibility();
  setupServiceWorker();
  initFeatureSlider();
  initHeroSlider();
  initContactSuccessMessage();
  initFirstImpressionsSlider();
  initModal();
  updateCurrentYear();
});

// 1. Accessibility Features
function initAccessibility() {
  const currentPath = window.location.pathname;
  document.querySelectorAll('nav a').forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.setAttribute('aria-current', 'page');
    }
  });
}

// 2. Service Worker Registration
function setupServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('ServiceWorker registration successful');
        })
        .catch(err => {
          console.log('ServiceWorker registration failed:', err);
        });
    });
  }
}

// 3. Update Current Year
function updateCurrentYear() {
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

// 4. Feature Slider (Lazy Loaded Images & Lightbox)
function initFeatureSlider() {
  const slider = document.getElementById('feature-slider');
  const lightbox = document.getElementById('feature-lightbox');
  const modalImg = document.getElementById('feature-img-modal');
  const captionText = document.getElementById('feature-caption');
  const closeBtn = document.querySelector('.feature-close');
  const prevButton = document.getElementById('feature-prev');
  const nextButton = document.getElementById('feature-next');
  
  // Ensure required elements exist
  if (!slider || !lightbox || !modalImg || !captionText || !closeBtn || !prevButton || !nextButton) {
    console.warn('One or more feature slider elements not found.');
    return;
  }

  let currentIndex = 0;
  const images = [];
  let autoSlide;

  // Dynamically create image elements
  for (let i = 1; i <= 17; i++) {
    let img = document.createElement('img');
    img.src = `data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7`; // Placeholder
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

  // Lazy loading images
  function loadImage(img) {
    const src = img.dataset.src;
    if (src) {
      img.src = src;
      img.removeAttribute('data-src');
    }
  }

  function handleLazyLoad() {
    images.forEach(img => {
      if (img.getBoundingClientRect().top < window.innerHeight && img.dataset.src) {
        loadImage(img);
      }
    });
  }

  window.addEventListener('scroll', handleLazyLoad);
  handleLazyLoad(); // Initial check

  // Lightbox functionality
  function openLightbox(src, alt) {
    modalImg.src = src;
    modalImg.alt = alt;
    captionText.innerHTML = alt;
    lightbox.style.display = "block";
  }

  closeBtn.onclick = () => { 
    lightbox.style.display = "none";
  };

  window.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      lightbox.style.display = "none";
    }
  });

  // Slider navigation
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

  startSlide();
}

// 5. Hero Slider (Projects)
class HeroSlider {
  constructor() {
    this.API_URL = 'feature-project.json'; // Local file
    this.currentIndex = 0;
    this.intervalTime = 5000;
    this.intervalId = null;
    this.touchStartX = 0;
    this.touchEndX = 0;
  }

  async init() {
    try {
      this.projects = await this.getCachedData();
      this.createSlides();
      this.createDots();
      this.startAutoPlay();
      this.addEventListeners();
      const loadingElem = document.querySelector('.loading');
      if (loadingElem) loadingElem.remove();
    } catch (error) {
      this.handleError(error);
    }
  }

  async getCachedData() {
    const key = "heroProjects";
    let data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    } else {
      const response = await fetch(this.API_URL);
      if (!response.ok) throw new Error('Network response was not ok');
      data = await response.json();
      localStorage.setItem(key, JSON.stringify(data));
      return data;
    }
  }

  createSlides() {
    const slidesContainer = document.querySelector('.hero-slides');
    if (!slidesContainer) throw new Error("Hero slides container not found");
    this.slides = this.projects.map(project => {
      const slide = document.createElement('div');
      slide.className = 'hero-slide';
      
      const img = new Image();
      img.src = project['feature-project-thumbnail'];
      img.alt = project['feature-project-name'];
      img.loading = 'eager';
      
      const progress = document.createElement('div');
      progress.className = 'progress-bar';
      
      const content = document.createElement('div');
      content.className = 'hero-content';
      
      const text = document.createElement('div');
      text.className = 'hero-text';
      
      const title = document.createElement('h2');
      title.className = 'hero-title';
      title.textContent = project['feature-project-name'];
      
      const description = document.createElement('p');
      description.className = 'hero-description';
      description.textContent = project['feature-project-description'];
      
      text.append(title, description);
      content.appendChild(text);
      slide.append(img, progress, content);
      slidesContainer.appendChild(slide);
      return slide;
    });
    if (this.slides.length > 0) this.slides[0].classList.add('active');
  }

  createDots() {
    const dotsContainer = document.querySelector('.hero-dots');
    if (!dotsContainer) {
      console.warn("Hero dots container not found");
      return;
    }
    this.dots = this.projects.map((_, index) => {
      const dot = document.createElement('button');
      dot.className = 'hero-dot';
      dot.ariaLabel = `Go to slide ${index + 1}`;
      dot.addEventListener('click', () => this.goToSlide(index));
      dotsContainer.appendChild(dot);
      return dot;
    });
    if (this.dots && this.dots[0]) this.dots[0].classList.add('active');
  }

  goToSlide(index) {
    if (index === this.currentIndex) return;
    this.slides[this.currentIndex].classList.remove('active');
    if (this.dots && this.dots[this.currentIndex]) {
      this.dots[this.currentIndex].classList.remove('active');
    }
    this.currentIndex = index;
    this.slides[this.currentIndex].classList.add('active');
    if (this.dots && this.dots[this.currentIndex]) {
      this.dots[this.currentIndex].classList.add('active');
    }
    this.resetAutoPlay();
  }

  nextSlide() {
    const nextIndex = (this.currentIndex + 1) % this.slides.length;
    this.goToSlide(nextIndex);
  }

  startAutoPlay() {
    this.intervalId = setInterval(() => this.nextSlide(), this.intervalTime);
  }

  resetAutoPlay() {
    clearInterval(this.intervalId);
    this.startAutoPlay();
  }

  handleTouchStart(e) {
    this.touchStartX = e.changedTouches[0].screenX;
  }

  handleTouchEnd(e) {
    this.touchEndX = e.changedTouches[0].screenX;
    const diff = this.touchStartX - this.touchEndX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? this.nextSlide() : this.prevSlide();
    }
  }

  addEventListeners() {
    const heroContainer = document.querySelector('.hero-container');
    if (heroContainer) {
      heroContainer.addEventListener('touchstart', e => this.handleTouchStart(e));
      heroContainer.addEventListener('touchend', e => this.handleTouchEnd(e));
    }
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') this.prevSlide();
      if (e.key === 'ArrowRight') this.nextSlide();
    });
  }

  prevSlide() {
    const prevIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.goToSlide(prevIndex);
  }

  handleError(error) {
    console.error('Error:', error);
    const loading = document.querySelector('.loading');
    if (loading) {
      loading.innerHTML = `
        <div style="text-align: center">
          <p>⚠️ Failed to load content</p>
          <button onclick="location.reload()" 
                  style="margin-top: 1rem; padding: 0.5rem 1rem; background: white; border: none; border-radius: 4px; cursor: pointer">
              Retry
          </button>
        </div>
      `;
    }
  }
}

function initHeroSlider() {
  // Only initialize if the hero slider container exists
  if (document.querySelector('.hero-slides')) {
    const slider = new HeroSlider();
    slider.init();
  }
}

// 6. Display Contact Success Message (if present)
function initContactSuccessMessage() {
  const params = new URLSearchParams(window.location.search);
  const contactSuccessMessage = params.get('message');
  if (contactSuccessMessage) {
    const messageContainer = document.getElementById('contactSuccessMessage');
    if (messageContainer) {
      messageContainer.textContent = contactSuccessMessage;
      messageContainer.style.display = 'block';
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }
}

// 7. First Impressions Slider (Banner)
function initFirstImpressionsSlider() {
  const sliderTrack = document.querySelector('#first-impressions-slider .first-impressions-slider-track');
  if (!sliderTrack) return;

  function getFirstImpressionsData() {
    const key = "firstImpressionsData";
    return new Promise((resolve, reject) => {
      let data = localStorage.getItem(key);
      if (data) {
        resolve(JSON.parse(data));
      } else {
        fetch("first-impression-banner.json")
          .then(response => {
            if (!response.ok) {
              reject(new Error('Network response was not ok'));
            } else {
              return response.json();
            }
          })
          .then(data => {
            localStorage.setItem(key, JSON.stringify(data));
            resolve(data);
          })
          .catch(reject);
      }
    });
  }

  getFirstImpressionsData()
    .then(data => {
      data.sort((a, b) => a["first-impression-order"] - b["first-impression-order"]);
      let imagesHTML = "";
      data.forEach(item => {
        imagesHTML += `
          <div class="first-impressions-slide">
            <img src="${item["first-impression-image"]}" alt="${item["first-impression-caption"]}">
            <a href="${item["first-impression-project-link"]}" class="first-impressions-label project-link">
              ${item["first-impression-caption"]}
            </a>
          </div>`;
      });
      // Duplicate images on desktop for seamless scrolling
      sliderTrack.innerHTML = window.innerWidth >= 1024 ? imagesHTML + imagesHTML : imagesHTML;
    })
    .catch(error => {
      console.error("Error fetching banner JSON:", error);
    });
}

// 8. Modal Functionality
function initModal() {
  const openModalBtn = document.getElementById('openModalBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const cvModal = document.getElementById('cvModal');
  if (!openModalBtn || !closeModalBtn || !cvModal) return;

  openModalBtn.addEventListener('click', () => {
    cvModal.classList.add('active');
  });
  closeModalBtn.addEventListener('click', () => {
    cvModal.classList.remove('active');
  });
  cvModal.addEventListener('click', (e) => {
    if (e.target === cvModal) {
      cvModal.classList.remove('active');
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cvModal.classList.contains('active')) {
      cvModal.classList.remove('active');
    }
  });
}

// 9. Performance Monitoring (Not affecting load speed)
window.addEventListener('load', () => {
  const timing = window.performance.timing;
  const loadTime = timing.loadEventEnd - timing.navigationStart;
  console.log(`Page loaded in ${loadTime}ms`);
});

// 10. Global Error Handling
window.onerror = function(message, source, lineno, colno, error) {
  console.error(`Error: ${message} at ${source}:${lineno}:${colno}`);
  return true;
};

// 11. Unhighlighted Features
function initUnHighlightedFeatures() {
  const section = document.getElementById("un-highlighted-features");
  if (!section) return;

  function getCategoriesData() {
    const key = "categoriesData";
    return new Promise((resolve, reject) => {
      let data = localStorage.getItem(key);
      if (data) {
        resolve(JSON.parse(data));
      } else {
        fetch("feature-project-category.json")
          .then(response => {
            if (!response.ok) {
              reject(new Error('Network response was not ok'));
            } else {
              return response.json();
            }
          })
          .then(data => {
            localStorage.setItem(key, JSON.stringify(data));
            resolve(data);
          })
          .catch(reject);
      }
    });
  }

  function getProjectsData() {
    const key = "projectsData";
    return new Promise((resolve, reject) => {
      let data = localStorage.getItem(key);
      if (data) {
        resolve(JSON.parse(data));
      } else {
        fetch("feature-project.json")
          .then(response => {
            if (!response.ok) {
              reject(new Error('Network response was not ok'));
            } else {
              return response.json();
            }
          })
          .then(data => {
            localStorage.setItem(key, JSON.stringify(data));
            resolve(data);
          })
          .catch(reject);
      }
    });
  }

  Promise.all([getCategoriesData(), getProjectsData()])
    .then(([categories, projects]) => {
      // Filter projects that are un-highlighted
      const unhighlightedProjects = projects.filter(
        (p) => p["feature-project-type"] === "un-highlighted"
      );

      // Group projects by their main category id
      const grouped = {};
      unhighlightedProjects.forEach((project) => {
        const catId = project["project-feature-main-category-id"];
        if (!grouped[catId]) {
          grouped[catId] = [];
        }
        grouped[catId].push(project);
      });

      // For each category, create a slider if there are projects
      categories.forEach((category) => {
        const catId = category.id;
        if (grouped[catId] && grouped[catId].length > 0) {
          // Create a card container for the category slider
          const card = document.createElement("div");
          card.className = "un-highlighted-category-slider";

          // Create slider wrapper
          const sliderWrapper = document.createElement("div");
          sliderWrapper.className = "un-highlighted-slider-wrapper";

          // Create a clickable link that wraps header and slider container
          const link = document.createElement("a");
          link.href = "details.html?cat=" + encodeURIComponent(category.id);
          link.className = "un-highlighted-features-slider-link";

          // Create category header (title and description)
          const headerDiv = document.createElement("div");
          headerDiv.className = "un-highlighted-category-header";
          const categoryTitle = document.createElement("h2");
          categoryTitle.textContent = category.categoryName;
          headerDiv.appendChild(categoryTitle);
          const categoryDesc = document.createElement("p");
          categoryDesc.className = "un-highlighted-category-description";
          categoryDesc.textContent = category.description;
          headerDiv.appendChild(categoryDesc);

          // Append the header to the clickable link
          link.appendChild(headerDiv);

          // Create slider container
          const sliderContainer = document.createElement("div");
          sliderContainer.className = "un-highlighted-features-slider-container";

          // Create slider track
          const sliderTrack = document.createElement("div");
          sliderTrack.className = "un-highlighted-features-slider-track";

          // Group slides by project
          const projectSlides = [];
          grouped[catId].forEach((project) => {
            const gallery = project["feature-project-gallery"];
            if (gallery && gallery.length >= 2) {
              const slidesForProject = [];
              for (let i = 0; i < 2; i++) {
                const slide = document.createElement("div");
                slide.className = "un-highlighted-features-slide";
                const img = document.createElement("img");
                img.src = gallery[i].image;
                img.alt = gallery[i]["alt-text"] || project["feature-project-name"];
                slide.appendChild(img);
                slidesForProject.push(slide);
              }
              projectSlides.push(slidesForProject);
            }
          });

          // Interleave slides from different projects
          let finalSlides = [];
          if (projectSlides.length > 1) {
            seededShuffleArray(projectSlides, 12345);
            const numberOfSlidesPerProject = projectSlides[0].length; // 2
            for (let i = 0; i < numberOfSlidesPerProject; i++) {
              projectSlides.forEach((slidesForProject) => {
                if (slidesForProject[i]) {
                  finalSlides.push(slidesForProject[i]);
                }
              });
            }
          } else if (projectSlides.length === 1) {
            finalSlides = projectSlides[0];
          }

          // Append final slides to the slider track
          finalSlides.forEach((slide) => sliderTrack.appendChild(slide));

          // Append the slider track to the slider container
          sliderContainer.appendChild(sliderTrack);

          // Append the slider container to the clickable link
          link.appendChild(sliderContainer);

          // Append the clickable link to the slider wrapper
          sliderWrapper.appendChild(link);

          // Append the slider wrapper to the card
          card.appendChild(sliderWrapper);

          // Append the card to the main section
          section.appendChild(card);
        }
      });
    })
    .catch(error => {
      console.error("Error fetching un-highlighted features:", error);
    });
}

// Seeded pseudo-random number generator (mulberry32)
function mulberry32(a) {
  return function () {
    var t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Seeded shuffle function
function seededShuffleArray(array, seed) {
  const random = mulberry32(seed);
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Initialize Unhighlighted Features
document.addEventListener("DOMContentLoaded", initUnHighlightedFeatures);

















  // Save scroll position when a project is clicked
  document.querySelectorAll('.project-link').forEach(link => {
    link.addEventListener('click', () => {
      sessionStorage.setItem('indexScroll', window.scrollY);
    });
  });
  // Restore scroll position on page load
  document.addEventListener('DOMContentLoaded', () => {
    const scrollY = sessionStorage.getItem('indexScroll');
    if (scrollY !== null) {
      window.scrollTo({ top: parseInt(scrollY), behavior: 'smooth' });
      sessionStorage.removeItem('indexScroll');
    }
  });