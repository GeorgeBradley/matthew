const API_URL = 'https://GeorgeBradley.github.io/matthew/feature-project.json';
const detailsContainer = document.getElementById('project-detail-container');
const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get('id');

async function fetchProjectDetails() {
    if (!projectId) redirectToIndex();

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Network response failed');
        const projects = await response.json();

        const project = projects.find(p => p.id === Number(projectId));
        
        if (!project) throw new Error('Project not found');
        renderProjectDetails(project);

    } catch (error) {
        console.error('Error:', error);
        showDetailError();
    }
}

function renderProjectDetails(project) {
    const sortedGallery = project["feature-project-gallery"] 
        ? [...project["feature-project-gallery"]].sort((a, b) => a.order - b.order) 
        : [];

    detailsContainer.innerHTML = `
        <article class="project-detail">
            <a href="index.html" class="back-button">← Back to Projects</a>
            
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
                <p class="project-description">${project["feature-project-description"]}</p>

                ${sortedGallery.length ? `
                <div class="gallery-section">
                    <h2>Gallery</h2>
                    <div class="gallery-grid" data-gallery='${JSON.stringify(sortedGallery)}'>
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

            <div class="lightbox" id="galleryLightbox">
                <div class="lightbox-content">
                    <div class="lightbox-image-container">
                        <img class="lightbox-image" src="" alt="">
                    </div>
                    <div class="lightbox-description"></div>
                </div>
                <span class="close-btn">&times;</span>
                <button class="prev-btn">❮</button>
                <button class="next-btn">❯</button>
            </div>
        </article>
    `;

    // Lightbox functionality
    const galleryThumbnails = detailsContainer.querySelectorAll('.gallery-thumbnail');
    const lightbox = detailsContainer.querySelector('#galleryLightbox');
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxDescription = lightbox.querySelector('.lightbox-description');
    const closeBtn = lightbox.querySelector('.close-btn');
    const prevBtn = lightbox.querySelector('.prev-btn');
    const nextBtn = lightbox.querySelector('.next-btn');

    let currentIndex = 0;
    let galleryData = [];

    galleryThumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            const galleryGrid = thumbnail.closest('.gallery-grid');
            galleryData = JSON.parse(galleryGrid.dataset.gallery);
            currentIndex = parseInt(thumbnail.dataset.index);
            updateLightbox(currentIndex);
            lightbox.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });

    closeBtn.addEventListener('click', () => {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
        updateLightbox(currentIndex);
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % galleryData.length;
        updateLightbox(currentIndex);
    });

    function updateLightbox(index) {
        const image = galleryData[index];
        lightboxImage.src = image.image;
        lightboxImage.alt = image['alt-text'];
        lightboxDescription.textContent = image.description;
    }

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Handle keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'flex') {
            if (e.key === 'ArrowLeft') {
                prevBtn.click();
            } else if (e.key === 'ArrowRight') {
                nextBtn.click();
            } else if (e.key === 'Escape') {
                closeBtn.click();
            }
        }
    });
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
