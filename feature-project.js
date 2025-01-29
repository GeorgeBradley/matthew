  
    // Generate unique ID
    function generateUID() {
        return crypto.randomUUID(); // Modern browser API for proper UUIDs
    }

  // Embedded JSON data

  const projects = [
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
        "feature-project-name": "Walrus",
        "feature-project-description": "18th-century style string puppets for historical reenactments",
        "feature-project-thumbnail": "feature-img/feature-2.jpg",
        "feature-project-link": "https://stringtheorycreations.com/marionette-revival",
        "feature-project-start-year": null,
        "feature-project-end-year": null,
        "feature-project-company-name": "StringTheory Creations",
        "feature-project-skills": ["wood carving", "costume design", "string mechanics", "period research"],
        "feature-project-job-category": "Marionette Artist",
        "feature-project-client": "European Cultural Heritage Foundation"
    },
    // Add remaining 19 entries here...
    {
        "feature-project-name": "Eco-Friendly Hand Puppets",
        "feature-project-description": "Sustainable recycled material puppets for children's education",
        "feature-project-thumbnail": "feature-img/feature-3.jpg",
        "feature-project-link": "https://greenpuppets.org/eco-series",
        "feature-project-start-year": 2021,
        "feature-project-end-year": null,
        "feature-project-company-name": "EcoPuppet Workshop",
        "feature-project-skills": ["recycled material construction", "educational scripting", "child safety standards"],
        "feature-project-job-category": "Educational Puppeteer",
        "feature-project-client": "UNICEF Learning Initiative"
    },
    // Add remaining 19 entries here...
    {
        "feature-project-name": "Eco-Friendly Hand Puppets",
        "feature-project-description": "Sustainable recycled material puppets for children's education",
        "feature-project-thumbnail": "feature-img/feature-3.jpg",
        "feature-project-link": "https://greenpuppets.org/eco-series",
        "feature-project-start-year": 2021,
        "feature-project-end-year": null,
        "feature-project-company-name": "EcoPuppet Workshop",
        "feature-project-skills": ["recycled material construction", "educational scripting", "child safety standards"],
        "feature-project-job-category": "Educational Puppeteer",
        "feature-project-client": "UNICEF Learning Initiative"
    }
    ,
    // Add remaining 19 entries here...
    {
        "feature-project-name": "Eco-Friendly Hand Puppets",
        "feature-project-description": "Sustainable recycled material puppets for children's education",
        "feature-project-thumbnail": "feature-img/feature-3.jpg",
        "feature-project-link": "https://greenpuppets.org/eco-series",
        "feature-project-start-year": 2021,
        "feature-project-end-year": null,
        "feature-project-company-name": "EcoPuppet Workshop",
        "feature-project-skills": ["recycled material construction", "educational scripting", "child safety standards"],
        "feature-project-job-category": "Educational Puppeteer",
        "feature-project-client": "UNICEF Learning Initiative"
    }
    ,
    // Add remaining 19 entries here...
    {
        "feature-project-name": "Eco-Friendly Hand Puppets",
        "feature-project-description": "Sustainable recycled material puppets for children's education",
        "feature-project-thumbnail": "feature-img/feature-3.jpg",
        "feature-project-link": "https://greenpuppets.org/eco-series",
        "feature-project-start-year": 2021,
        "feature-project-end-year": null,
        "feature-project-company-name": "EcoPuppet Workshop",
        "feature-project-skills": ["recycled material construction", "educational scripting", "child safety standards"],
        "feature-project-job-category": "Educational Puppeteer",
        "feature-project-client": "UNICEF Learning Initiative"
    }
    
].map(project => {
    const uid = generateUID();
    return {
        ...project,
        id: uid,
        "feature-project-link": `details.html?id=${uid}`
    };
});

 // Create project card with dedicated details button
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

    // Add click handler to details button
    card.querySelector('.details-button').addEventListener('click', (e) => {
        localStorage.setItem(project.id, JSON.stringify(project));
        window.location.href = project['feature-project-link'];
    });

    return card;
}

// Render projects
document.getElementById('projects-container').append(...projects.map(createProjectCard));














