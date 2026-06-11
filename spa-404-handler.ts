/**
 * SPA 404 redirect handler for GitHub Pages.
 *
 * GitHub Pages serves a custom 404.html for unknown routes. This script,
 * embedded in that page, encodes the original URL into a query string and
 * redirects to the app root so the SPA can decode and restore the correct
 * route on load (handled by spa-redirect.ts in index.html).
 *
 * @see https://github.com/rafgraph/spa-github-pages
 */

export {};

const SEGMENT_COUNT = 1;

const l: Location = window.location;

l.replace(
	l.protocol +
		"//" +
		l.hostname +
		(l.port ? ":" + l.port : "") +
		l.pathname
			.split("/")
			.slice(0, 1 + SEGMENT_COUNT)
			.join("/") +
		"/?/" +
		l.pathname
			.slice(1)
			.split("/")
			.slice(SEGMENT_COUNT)
			.join("/")
			.replace(/&/g, "~and~") +
		(l.search ? "&" + l.search.slice(1).replace(/&/g, "~and~") : "") +
		l.hash,
);
