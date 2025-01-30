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