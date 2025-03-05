export async function onRequestGet({ params, request, env }) {
  // Fetch feature-project.json (assumed to be in the public directory)
  const jsonUrl = new URL('/feature-project.json', request.url).toString();
  const response = await fetch(jsonUrl);
  const projects = await response.json();

  // Create slug-to-ID mapping
  const slugToId = {};
  projects.forEach(project => {
    const slug = slugify(project["feature-project-name"]);
    slugToId[slug] = project.id;
  });

  const slug = params.slug; // e.g., "walrus"
  const projectId = slugToId[slug];

  if (!projectId) {
    return new Response("Project not found", { status: 404 });
  }

  // Rewrite the request to details.html with the ID as a query parameter
  const newUrl = new URL(request.url);
  newUrl.pathname = '/details.html';
  newUrl.searchParams.set('id', projectId);

  // Fetch the static details.html with the modified URL
  const htmlResponse = await env.ASSETS.fetch(newUrl);
  return htmlResponse;
}
