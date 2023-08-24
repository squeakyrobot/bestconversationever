import type { RequestHandler } from './$types';
import { RedisClient } from '$lib/server/redis';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals }) => {
    try {
        const redis = new RedisClient();
        const convoList = await redis.getConversationList(locals.session.user.id);

        return json(convoList);
    }
    catch (e) {
        console.error('Failed to retrieve inbox from api', e);
        return json([]);
    }
};