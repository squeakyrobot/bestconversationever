import type { PageServerLoad } from './$types';
import { RedisClient } from '$lib/server/redis';
import { error } from '@sveltejs/kit';

export const load = (async ({ params, locals }) => {

    const conversation = await (new RedisClient(locals.session)).getConversation(params.conversationId);

    if (!conversation) {
        throw error(404, 'Conversation not found');
    }

    // TODO: add the ability to get a specific message

    const userName = conversation.messages[0].name; // TODO: Fix

    const pageTitle = `View my chat with ${conversation.character}`;
    const pageDescription = `Conversation between ${conversation.character} and ${userName}`;
    const pageOgImage = `/images/characters/${conversation.character}-view-og.png`;

    return { user: locals.session.user, conversation, pageTitle, pageDescription, pageOgImage };
}) satisfies PageServerLoad;