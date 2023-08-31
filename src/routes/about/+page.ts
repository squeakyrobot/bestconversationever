import type { PageLoad } from "./$types";

export const prerender = true;

export const load = (() => {
    return {
        pageTitle: 'About having the best conversation ever',
        pageDescription: 'Learn more about the site',
    };
}) satisfies PageLoad;
