// details.html
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
        const project = projects.find(p => p.id === projectId);
        
        if (!project) throw new Error('Project not found');
        renderProjectDetails(project);
        
    } catch (error) {
        console.error('Error:', error);
        showDetailError();
    }
}

function renderProjectDetails(project) {
    detailsContainer.innerHTML = `
        <article class="project-detail">
            <a href="index.html" class="back-button">← Back to Projects</a>
            
            <div class="detail-header">
                <h1 class="project-title">${project.name}</h1>
                ${project.startYear ? `
                <div class="project-meta">
                    <span class="date-range">
                        ${project.startYear}${project.endYear ? ` - ${project.endYear}` : ''}
                    </span>
                </div>` : ''}
            </div>

            <img src="${project.thumbnail}" 
                 alt="${project.name}" 
                 class="detail-image">

            <div class="detail-content">
                <p class="project-description">${project.description}</p>

                <div class="detail-grid">
                    ${project.company ? `
                    <div class="detail-item">
                        <h3>Company</h3>
                        <p>${project.company}</p>
                    </div>` : ''}
                    
                    ${project.client ? `
                    <div class="detail-item">
                        <h3>Client</h3>
                        <p>${project.client}</p>
                    </div>` : ''}
                    
                    ${project.skills?.length ? `
                    <div class="detail-item">
                        <h3>Skills Used</h3>
                        <div class="skill-list">
                            ${project.skills.map(skill => `
                                <span class="skill-tag">${skill}</span>
                            `).join('')}
                        </div>
                    </div>` : ''}
                </div>
            </div>
        </article>
    `;
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