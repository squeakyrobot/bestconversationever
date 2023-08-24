import { RedisClient } from '$lib/server/redis';
import type { PageServerLoad } from './$types';


export const load = (async ({ locals }) => {

    const redis = new RedisClient();
    const convoList = await redis.getConversationList(locals.session.user.id);

    const pageTitle = `Inbox`;
    const pageDescription = `TEMP`;

    return { pageTitle, pageDescription, convoList };
}) satisfies PageServerLoad;