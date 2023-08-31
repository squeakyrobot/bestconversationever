import { Character } from '$lib/personality';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = async () => {
    // TODO: make this dynamic
    const lastMod = '2023-08-20';

    const characterEntries = Object.keys(Character).map((v) => {
        return `<url>
            <loc>https://bestconversationever.com/chat/${v.toLowerCase()}</loc>
            <lastmod>${lastMod}</lastmod>
        </url>`;
    });

    return new Response(
        `
      <?xml version="1.0" encoding="UTF-8" ?>
      <urlset
        xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="https://www.w3.org/1999/xhtml"
        xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
      >
        <url>
            <loc>https://bestconversationever.com</loc>
            <lastmod>${lastMod}</lastmod>
        </url>
        <url>
            <loc>https://bestconversationever.com/about</loc>
            <lastmod>${lastMod}</lastmod>
        </url>
        <url>
            <loc>https://bestconversationever.com/chat</loc>
            <lastmod>${lastMod}</lastmod>
        </url>
        ${characterEntries}
      </urlset>`.trim(),
        {
            headers: {
                'Content-Type': 'application/xml'
            }
        }
    );
}