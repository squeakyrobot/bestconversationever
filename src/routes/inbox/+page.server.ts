import type { PageServerLoad } from './$types';
import { RedisClient } from '$lib/server/redis';
import { UserType } from '$lib/user';


export const load = (async ({ locals }) => {

    const redis = new RedisClient(locals.session);
    const convoList = await redis.getConversationList(locals.session.user.id);

    const titleMsg = (locals.session.user.type !== UserType.Authenticated) ?
        ' - Not signed in' : '';

    const pageTitle = `Inbox${titleMsg}`;
    const pageDescription = (locals.session.user.type !== UserType.Authenticated) ?
        'You are not logged in. Create an account or login to save your chats.' :
        '';

    return { user: locals.session.user, pageTitle, pageDescription, convoList };

}) satisfies PageServerLoad;