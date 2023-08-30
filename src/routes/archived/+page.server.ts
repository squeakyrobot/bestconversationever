import type { PageServerLoad } from './$types';
import { RedisClient } from '$lib/server/redis';


export const load = (async ({ locals }) => {

    const redis = new RedisClient(locals.session);
    const convoList = await redis.getConversationList(locals.session.user.id, true);

    const pageTitle = 'Archived Conversations';
    const pageDescription = pageTitle;

    return { pageTitle, pageDescription, convoList };

}) satisfies PageServerLoad;