import type { PageLoad } from './$types';

export const load = (async () => {
    return { time: Date.now() };
}) satisfies PageLoad;