import routes from '../../project-routes.json';
export function onRequestGet({params, request}) {
  const path = Object.values(routes.projects).find(path => path.endsWith('/' + params.slug));
  if (!path) return new Response('Project not found', {status:404});
  return Response.redirect(new URL(path, request.url).href, 301);
}
