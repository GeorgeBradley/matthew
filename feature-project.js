// index.html
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
        <img src="${project['feature-project-thumbnail']}" 
             alt="${project['feature-project-name']}" 
             class="card-image">
        <div class="card-content">
            <h2 class="project-name">${project['feature-project-name']}</h2>
            <p class="project-description">${project['feature-project-description']}</p>
            
            ${project['feature-project-start-year'] ? `
            <div class="meta-info">
                <span class="date-range">
                    ${project['feature-project-start-year']}${project['feature-project-end-year'] ? ` - ${project['feature-project-end-year']}` : ''}
                </span>
            </div>` : ''}
            
            <div class="project-footer">
                <a href="details.html?id=${project.id}" class="details-button">
                    View Project →
                </a>
            </div>
        </div>
    `;
    return card;
}
function showLoading() {
    projectsContainer.innerHTML = `
        <div class="loading-state">
            <div class="spinner"></div>
            <p>Loading projects...</p>
        </div>
    `;
}

function showError() {
    projectsContainer.innerHTML = `
        <div class="error-state">
            <p>⚠️ Failed to load projects</p>
            <button class="retry-button" onclick="loadProjects()">Try Again</button>
        </div>
    `;
}

async function loadProjects() {
    showLoading();
    const projects = await fetchProjects();
    
    if (projects && projects.length) {
        projectsContainer.innerHTML = '';
        projects.forEach(project => {
            projectsContainer.appendChild(createProjectCard(project));
        });
    }
}

// Initial load
loadProjects();