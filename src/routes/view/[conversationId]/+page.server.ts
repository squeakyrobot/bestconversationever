import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { RedisClient } from '$lib/server/redis';

export const load = (async ({ params }) => {

    const conversation = await (new RedisClient()).getConversation(params.conversationId);

    if (!conversation) {
        throw error(404, 'Conversation not found');
    }

    // TODO: add the ability to get a specific message

    const userName = conversation.messages[0].name; // TODO: Fix

    const pageTitle = `View my chat with ${conversation.character}`;
    const pageDescription = `Conversation between ${conversation.character} and ${userName}`;
    const pageOgImage = `/images/characters/${conversation.character}-view-og.png`;

    return { conversation, pageTitle, pageDescription, pageOgImage };
}) satisfies PageServerLoad;