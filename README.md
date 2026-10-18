# Matthew Bradley portfolio

Production domain: https://mgbradley.uk

The site is served by Cloudflare Pages. HTML and responsive image variants are
checked in, so deployment does not require a new cloud build command.

## Editing content

- Edit project copy and gallery descriptions in `feature-project.json`.
- Edit CV content in `cv-content.json`. Its experience is explicitly dated to the
  existing 2024 CV; do not describe the old current role as current without checking.
- Edit category copy in `feature-project-category.json` (public categories 1 to 4).
- Edit the shared layout in `build_site.py`, styling in `portfolio.css`, and
  progressive enhancements in `portfolio.js`.
- Run `python build_site.py` with Pillow installed, then commit both sources and
  generated output. It generates project/category HTML, metadata, a sitemap,
  robots.txt and responsive WebP images with content-based filenames.
- Run `python build_cv.py` with ReportLab installed after changing CV copy.
- Run `python verify_site.py` and `node --check portfolio.js` before publishing.
- Run `wrangler pages dev . --port 8893` to check actual Pages routing locally.

Normal navigation, project text, galleries and enquiry forms work without
JavaScript. JavaScript enhances the mobile menu, project search and filters,
optional slideshow and gallery dialog. The home page includes all 21 projects
in HTML. With JavaScript, it starts with selected work; visitors can search the
whole collection or filter by specialism. Filter and search query parameters
preserve the view when returning from a project. The slideshow only moves after
the visitor presses Play. Gallery controls support keyboard navigation, touch
swipes, original-image links and focus restoration when closed.
Original gallery files remain available at their existing URLs.

## Routing and SEO

Projects use `/projects/<slug>` and categories use `/categories/<slug>`.
Cloudflare Functions redirect old `/details?id=...`, `/details.html?id=...` and
category query links. The static details page also has a script fallback and a
complete list of project links for static hosts.

Canonicals and sharing URLs point to `mgbradley.uk`. No claim is made that the
separate `mgbradley.com` Squarespace domain has been redirected. Its DNS and
ownership require separate confirmation. Search Console verification and sitemap
submission must be completed in the owner's account.

## Contact and content corrections

The public 2024 CV and portfolio both list `mgbradley.uk@gmail.com`. The displayed
address now matches the existing FormSubmit recipient. Successful form completion
returns to `/thank-you` on the same domain. Inbox delivery still needs an owner
check; automated validation does not send a real enquiry.

Arthur the Mail Snail previously duplicated the complete Styxosaurus gallery.
Its page now uses the existing Arthur photograph; the Styxosaurus images remain
on their correct project. Gallery descriptions were checked against the photos.

The upstream tree contains an old unused filename with CR/LF characters under
`details/`. Windows checkouts need to omit that directory. It is unrelated to the
Cloudflare Functions folder and has not been removed from repository history.
