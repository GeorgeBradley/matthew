function loadProjectDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');
    const project = JSON.parse(localStorage.getItem(projectId));

    if (!project) {
        window.location.href = 'index.html';
        return;
    }

    const container = document.getElementById('project-detail-container');
    container.innerHTML = `
        <article class="project-detail">
            <img src="${project['feature-project-thumbnail']}" 
                 class="detail-image"
                 alt="${project['feature-project-name']}">
            
            <div class="detail-section">
                <h1 class="detail-title">${project['feature-project-name']}</h1>
                <p class="detail-text">${project['feature-project-description']}</p>
                
                ${project['feature-project-start-year'] || project['feature-project-end-year'] ? `
                <div class="detail-text">
                    <strong>Duration:</strong> 
                    ${project['feature-project-start-year'] || ''}
                    ${project['feature-project-end-year'] ? ` - ${project['feature-project-end-year']}` : ''}
                </div>` : ''}

                ${project['feature-project-company-name'] ? `
                <div class="detail-text">
                    <strong>Company:</strong> ${project['feature-project-company-name']}
                </div>` : ''}

                ${project['feature-project-client'] ? `
                <div class="detail-text">
                    <strong>Client:</strong> ${project['feature-project-client']}
                </div>` : ''}

                ${project['feature-project-job-category'] ? `
                <div class="detail-text">
                    <strong>Role:</strong> ${project['feature-project-job-category']}
                </div>` : ''}

                ${project['feature-project-skills']?.length ? `
                <div class="detail-text">
                    <strong>Skills:</strong> 
                    ${project['feature-project-skills'].join(', ')}
                </div>` : ''}
            </div>
        </article>
    `;
}

// Load project on page load
loadProjectDetails();