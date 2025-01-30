// Generate unique ID
function generateUID() {
    return crypto.randomUUID(); // Modern browser API for proper UUIDs
}

// Initialize projects with proper navigation handling
let projects = [];


  // Embedded JSON data
  function initializeProjects() {
    projects = [
    {
        "feature-project-name": "Shadow Puppet Odyssey",
        "feature-project-description": "Traditional leather shadow puppets for a mythological theater production",
        "feature-project-thumbnail": "feature-img/feature-1.jpg",
        "feature-project-link": "https://puppetcraft.com/shadow-odyssey",
        "feature-project-start-year": 2018,
        "feature-project-end-year": 2019,
        "feature-project-company-name": "PuppetCraft Studios",
        "feature-project-skills": ["leather carving", "dye painting", "articulation engineering", "storyboarding"],
        "feature-project-job-category": "Traditional Puppeteer",
        "feature-project-client": "National Folklore Theater"
    },
    {
        "feature-project-name": "Shadow Puppet Odyssey",
        "feature-project-description": "Traditional leather shadow puppets for a mythological theater production",
        "feature-project-thumbnail": "feature-img/feature-2.jpg",
        "feature-project-link": "https://puppetcraft.com/shadow-odyssey",
        "feature-project-start-year": 2018,
        "feature-project-end-year": 2019,
        "feature-project-company-name": "PuppetCraft Studios",
        "feature-project-skills": ["leather carving", "dye painting", "articulation engineering", "storyboarding"],
        "feature-project-job-category": "Traditional Puppeteer",
        "feature-project-client": "National Folklore Theater"
    },
    {
        "feature-project-name": "Shadow Puppet Odyssey",
        "feature-project-description": "Traditional leather shadow puppets for a mythological theater production",
        "feature-project-thumbnail": "feature-img/feature-3.jpg",
        "feature-project-link": "https://puppetcraft.com/shadow-odyssey",
        "feature-project-start-year": 2018,
        "feature-project-end-year": 2019,
        "feature-project-company-name": "PuppetCraft Studios",
        "feature-project-skills": ["leather carving", "dye painting", "articulation engineering", "storyboarding"],
        "feature-project-job-category": "Traditional Puppeteer",
        "feature-project-client": "National Folklore Theater"
    },
    {
        "feature-project-name": "Shadow Puppet Odyssey",
        "feature-project-description": "Traditional leather shadow puppets for a mythological theater production",
        "feature-project-thumbnail": "feature-img/feature-4.jpg",
        "feature-project-link": "https://puppetcraft.com/shadow-odyssey",
        "feature-project-start-year": 2018,
        "feature-project-end-year": 2019,
        "feature-project-company-name": "PuppetCraft Studios",
        "feature-project-skills": ["leather carving", "dye painting", "articulation engineering", "storyboarding"],
        "feature-project-job-category": "Traditional Puppeteer",
        "feature-project-client": "National Folklore Theater"
    },
    // ... other projects ...
].map(project => ({
    ...project,
    id: generateUID(),
    "feature-project-link": `details.html?id=${generateUID()}`
}));
}

// Create project card template
function createProjectCard(project) {
const card = document.createElement('article');
card.className = 'project-card';

card.innerHTML = `
    <span class="uid-badge">#${project.id.slice(0, 8)}</span>
    <img src="${project['feature-project-thumbnail']}" 
         alt="${project['feature-project-name']}" 
         class="card-image">
    <div class="card-content">
        <h2 class="project-name">${project['feature-project-name']}</h2>
        <p class="project-description">${project['feature-project-description']}</p>
        ${project['feature-project-start-year'] ? 
            `<div class="detail-item">
                ${project['feature-project-start-year']}${project['feature-project-end-year'] ? ` - ${project['feature-project-end-year']}` : ''}
            </div>` : ''}
        ${project['feature-project-company-name'] ? 
            `<div class="detail-item"><strong>Company:</strong> ${project['feature-project-company-name']}</div>` : ''}
        ${project['feature-project-client'] ? 
            `<div class="detail-item"><strong>Client:</strong> ${project['feature-project-client']}</div>` : ''}
        ${project['feature-project-skills']?.length ? 
            `<div class="skills-list">
                ${project['feature-project-skills'].map(skill => 
                    `<span class="skill-tag">${skill}</span>`
                ).join('')}
            </div>` : ''}
        ${project['feature-project-job-category'] ? 
            `<div class="detail-item"><strong>Role:</strong> ${project['feature-project-job-category']}</div>` : ''}
        <button class="details-button" data-id="${project.id}">See Details</button>
    </div>
`;

return card;
}

// Handle card clicks using event delegation
function handleCardClick(event) {
if (event.target.classList.contains('details-button')) {
    const projectId = event.target.dataset.id;
    const project = projects.find(p => p.id === projectId);
    
    if (project) {
        // Store in sessionStorage
        sessionStorage.setItem('currentProject', JSON.stringify(project));
        // Navigate to details page
        window.location.href = `details.html?id=${projectId}`;
    }
}
}

// Render projects with fresh event listeners
function renderProjects() {
const container = document.getElementById('projects-container');
container.innerHTML = '';
container.append(...projects.map(createProjectCard));
container.addEventListener('click', handleCardClick);
}

// Initialize the page
function init() {
initializeProjects();
renderProjects();
sessionStorage.removeItem('currentProject'); // Clear previous session data
}

// Handle page restoration from cache
window.addEventListener('pageshow', init);
document.addEventListener('DOMContentLoaded', init);