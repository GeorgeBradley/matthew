const API_URL = 'https://GeorgeBradley.github.io/matthew/feature-project.json';
const projectsContainer = document.getElementById('projects-container');

async function fetchProjects() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Network response failed');
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        showError();
        return null;
    }
}

function createProjectCard(project) {
    const card = document.createElement('article');
    card.className = 'project-card';
    card.innerHTML = `
        <a href="details.html?id=${project.id}" class="card-link" aria-label="View ${project['feature-project-name']} details">
            <div class="card-image-container">
                <img src="${project['feature-project-thumbnail']}" 
                     alt="${project['feature-project-name']}" 
                     class="card-image"
                     loading="lazy">
            </div>
            <div class="card-content">
                <h2 class="project-name">${project['feature-project-name']}</h2>
                <p class="project-description">${project['feature-project-description']}</p>
                
                <div class="meta-info">
                    ${project['feature-project-start-year'] ? `
                    <span class="date-range">
                        <svg viewBox="0 0 24 24">
                            <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
                            <path d="M13 7h-2v6h6v-2h-4z"/>
                        </svg>
                        ${project['feature-project-start-year']}${project['feature-project-end-year'] ? `–${project['feature-project-end-year']}` : ''}
                    </span>` : ''}
                    
                    ${project.type ? `<span class="project-type">${project.type}</span>` : ''}
                </div>
                
                ${project.skills ? `
                <div class="skill-tags">
                    ${project.skills.map(skill => `
                        <span class="skill-tag">${skill}</span>
                    `).join('')}
                </div>` : ''}
            </div>
        </a>
    `;
    return card;
}

function showLoading() {
    projectsContainer.innerHTML = `
        <div class="loading-state">
            <div class="skeleton-grid">
                ${Array(3).fill().map(() => `
                    <div class="skeleton-card"></div>
                `).join('')}
            </div>
        </div>
    `;
}

function showError() {
    projectsContainer.innerHTML = `
        <div class="error-state">
            <div class="error-icon">⚠️</div>
            <p>Failed to load projects. Please check your connection.</p>
            <button class="retry-button" onclick="loadProjects()">
                <svg viewBox="0 0 24 24" width="18" height="18">
                    <path fill="currentColor" d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                </svg>
                Try Again
            </button>
        </div>
    `;
}

async function loadProjects() {
    showLoading();
    const projects = await fetchProjects();
    
    if (projects && projects.length) {
        // Filter projects with "feature-project-type" equal to "highlighted"
        const filteredProjects = projects.filter(project => project['feature-project-type'] === 'highlighted');
        
        // Sort filtered projects based on "feature-project-order", defaulting to 0 if null
        filteredProjects.sort((a, b) => {
            const orderA = a['feature-project-order'] != null ? a['feature-project-order'] : 0;
            const orderB = b['feature-project-order'] != null ? b['feature-project-order'] : 0;
            return orderA - orderB;
        });
        
        projectsContainer.innerHTML = '';
        filteredProjects.forEach((project, index) => {
            const card = createProjectCard(project);
            card.style.animationDelay = `${index * 0.1}s`;
            projectsContainer.appendChild(card);
            observer.observe(card);
        });
    }
}

// Intersection Observer for animation triggers
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

// Initial load
loadProjects();
