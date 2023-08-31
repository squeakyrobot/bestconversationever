import type { PageServerLoad } from "./$types";

export const load = (async ({ locals }) => {

    const pageTitle = 'Settings';
    const pageDescription = pageTitle;

    return { user: locals.session.user, pageTitle, pageDescription };

}) satisfies PageServerLoad;