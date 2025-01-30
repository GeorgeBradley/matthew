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
        <img src="${project.thumbnail}" 
             alt="${project.name}" 
             class="card-image">
        <div class="card-content">
            <h2 class="project-name">${project.name}</h2>
            <p class="project-description">${project.description}</p>
            
            ${project.startYear ? `
            <div class="meta-info">
                <span class="date-range">
                    ${project.startYear}${project.endYear ? ` - ${project.endYear}` : ''}
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