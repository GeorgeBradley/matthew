// Full JavaScript
const API_URL = 'https://GeorgeBradley.github.io/matthew/feature-project.json';
const detailsContainer = document.getElementById('project-detail-container');
const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get('id');
let allProjects = [];

async function fetchProjectDetails() {
    if (!projectId) redirectToIndex();

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Network response failed');
        allProjects = await response.json();

        const project = allProjects.find(p => p.id === Number(projectId));
        if (!project) throw new Error('Project not found');
        
        renderProjectDetails(project, allProjects);
        initLightbox(project["feature-project-gallery"] || []);

    } catch (error) {
        console.error('Error:', error);
        showDetailError();
    }
}

function renderProjectDetails(project, projects) {
    const currentIndex = projects.findIndex(p => p.id === project.id);
    const prevProject = projects[currentIndex - 1];
    const nextProject = projects[currentIndex + 1];
    
    const sortedGallery = project["feature-project-gallery"] 
        ? [...project["feature-project-gallery"]].sort((a, b) => a.order - b.order) 
        : [];

    detailsContainer.innerHTML = `
        <article class="project-detail">
            <div class="detail-header">
                <h1 class="project-title">${project["feature-project-name"]}</h1>
                ${project["feature-project-start-year"] ? `
                <div class="project-meta">
                    <span class="date-range">
                        ${project["feature-project-start-year"]}${project["feature-project-end-year"] ? ` - ${project["feature-project-end-year"]}` : ''}
                    </span>
                </div>` : ''}
            </div>

            <img src="${project["feature-project-thumbnail"]}" 
                 alt="${project["feature-project-name"]}" 
                 class="detail-image">

            <div class="detail-content">
                <p class="project-description">${project["feature-project-long-description"]}</p>

                ${sortedGallery.length ? `
                <div class="gallery-section">
                    <h2>Gallery</h2>
                    <div class="gallery-grid">
                        ${sortedGallery.map((image, index) => `
                            <div class="gallery-item">
                                <div class="gallery-thumbnail-container">
                                    <img src="${image.image}" 
                                         alt="${image['alt-text']}" 
                                         class="gallery-thumbnail" 
                                         data-index="${index}">
                                </div>
                                <div class="gallery-caption">${image.description}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>` : ''}

                <div class="detail-grid">
                    ${project["feature-project-company-name"] ? `
                    <div class="detail-item">
                        <h3>Company</h3>
                        <p>${project["feature-project-company-name"]}</p>
                    </div>` : ''}
                    
                    ${project["feature-project-client"] ? `
                    <div class="detail-item">
                        <h3>Client</h3>
                        <p>${project["feature-project-client"]}</p>
                    </div>` : ''}
                    
                    ${project["feature-project-skills"]?.length ? `
                    <div class="detail-item">
                        <h3>Skills Used</h3>
                        <div class="skill-list">
                            ${project["feature-project-skills"].map(skill => `
                                <span class="skill-tag">${skill}</span>
                            `).join('')}
                        </div>
                    </div>` : ''}
                </div>
            </div>

            <div class="project-navigation">
                ${prevProject ? `
                    <a href="details.html?id=${prevProject.id}" class="nav-button prev-project">
                        ← Previous Project
                        <span>${prevProject["feature-project-name"]}</span>
                    </a>
                ` : '<div class="nav-spacer"></div>'}
                
                ${nextProject ? `
                    <a href="details.html?id=${nextProject.id}" class="nav-button next-project">
                        Next Project →
                        <span>${nextProject["feature-project-name"]}</span>
                    </a>
                ` : '<div class="nav-spacer"></div>'}
            </div>

            <div class="lightbox" id="galleryLightbox">
                <div class="lightbox-content">
                    <div class="lightbox-image-container">
                        <img class="lightbox-image" src="" alt="">
                    </div>
                    <div class="lightbox-description"></div>
                </div>
                <button class="close-btn" aria-label="Close lightbox"></button>
                <button class="nav-btn prev-btn" aria-label="Previous image"></button>
                <button class="nav-btn next-btn" aria-label="Next image"></button>
            </div>
        </article>
    `;
}

function initLightbox(galleryImages) {
    const lightbox = document.getElementById('galleryLightbox');
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxImageContainer = lightbox.querySelector('.lightbox-image-container');
    const lightboxDescription = lightbox.querySelector('.lightbox-description');
    const closeBtn = lightbox.querySelector('.close-btn');
    const prevBtn = lightbox.querySelector('.prev-btn');
    const nextBtn = lightbox.querySelector('.next-btn');
    const galleryItems = document.querySelectorAll('.gallery-thumbnail');
    
    let currentImageIndex = 0;
    let touchStartX = 0;

    function updateLightbox(index) {
        currentImageIndex = (index + galleryImages.length) % galleryImages.length;
        const image = galleryImages[currentImageIndex];
        
        lightboxImage.style.opacity = '0';
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        lightboxImageContainer.appendChild(spinner);
        
        const img = new Image();
        img.src = image.image;
        img.onload = () => {
            spinner.remove();
            lightboxImage.src = image.image;
            lightboxImage.alt = image['alt-text'];
            lightboxDescription.textContent = image.description;
            lightboxImage.style.opacity = '1';
        };
    }

    function handleSwipe(direction) {
        if (direction === 'left') nextImage();
        if (direction === 'right') prevImage();
    }

    function nextImage() {
        updateLightbox(currentImageIndex + 1);
    }

    function prevImage() {
        updateLightbox(currentImageIndex - 1);
    }

    // Event Listeners
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentImageIndex = index;
            updateLightbox(currentImageIndex);
            lightbox.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });

    closeBtn.addEventListener('click', () => {
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
    });

    prevBtn.addEventListener('click', prevImage);
    nextBtn.addEventListener('click', nextImage);

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'flex') {
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'Escape') closeBtn.click();
        }
    });

    // Touch Handling
    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });

    lightbox.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const deltaX = touchEndX - touchStartX;
        
        if (Math.abs(deltaX) > 50) {
            handleSwipe(deltaX > 0 ? 'right' : 'left');
        }
    });

    lightbox.addEventListener('touchmove', (e) => {
        e.preventDefault();
    }, { passive: false });
}

function showDetailError() {
    detailsContainer.innerHTML = `
        <div class="error-state">
            <p>⚠️ Project not found</p>
            <a href="index.html" class="back-button">Return to Projects</a>
        </div>
    `;
}

function redirectToIndex() {
    window.location.href = 'index.html';
}

// Initial load
if (projectId) {
    fetchProjectDetails();
} else {
    redirectToIndex();
}
