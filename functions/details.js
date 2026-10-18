import routes from '../project-routes.json';

// Preserve inbound links to the former query-string project pages.
export function onRequestGet({request}) {
  const url = new URL(request.url);
  const path = routes.projects[url.searchParams.get('id')] || routes.categories[url.searchParams.get('cat')];
  if (!path) return new Response('Project not found. Visit https://mgbradley.uk/#projects-container', {status:404});
  return Response.redirect(new URL(path, request.url).href, 301);
}
