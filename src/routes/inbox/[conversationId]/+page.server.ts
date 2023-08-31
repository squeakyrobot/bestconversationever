import type { PageServerLoad } from './$types';
import { RedisClient } from '$lib/server/redis';
import { assert } from '$lib/assert';
import { error } from '@sveltejs/kit';

export const load = (async ({ locals, params }) => {
    try {
        const conversationId = params.conversationId;
        assert(conversationId, 'Missing conversationId');

        const redis = new RedisClient(locals.session);
        const conversation = await redis.getConversation(conversationId);

        assert(conversation, error(404, 'Conversation not found'));
        assert(conversation.userId === locals.session.user.id, error(403, 'Forbidden'));

        const pageTitle = `Chat with ${conversation.character}`;
        const pageDescription = `Your conversation with ${conversation.character}`;


        return { user: locals.session.user, conversation, pageTitle, pageDescription };
    }
    catch (e) {
        console.error(e);
        throw e;
    }
}) satisfies PageServerLoad;