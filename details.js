document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('id');
    const storedProject = sessionStorage.getItem('currentProject');

    // Validate project data
    if (!projectId || !storedProject) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const project = JSON.parse(storedProject);
        
        // Security check - verify ID match
        if (project.id !== projectId) {
            throw new Error('Project ID mismatch');
        }

        // Render project details
        renderProjectDetails(project);
        
    } catch (error) {
        console.error('Error loading project:', error);
        window.location.href = 'index.html';
    }
});

function renderProjectDetails(project) {
    const container = document.getElementById('project-detail-container');
    
    // Build your detail page template here
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

    // Clear session storage after successful render
    sessionStorage.removeItem('currentProject');
}
// Load project on page load
loadProjectDetails();  container.innerHTML = `
       
    `;