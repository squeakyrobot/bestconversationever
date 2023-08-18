import { kv } from '@vercel/kv';
import type { PageServerLoad } from './$types';
import type { Conversation } from '$lib/stores/conversation';
import { error } from '@sveltejs/kit';
import { getEnvironmentPrefix } from '$lib/server/environment';

export const load = (async ({ params }) => {

    const convoKey = `${getEnvironmentPrefix()}:convo:${params.conversationId}`;
    const conversation = await kv.json.get(convoKey) as Conversation;

    if (!conversation) {
        throw error(404, 'Conversation not found');
    }

    // TODO: add the ability to get a specific message

    const userName = conversation.messages[0].name; // TODO: Fix

    const pageTitle = `Chat between ${conversation.character} and ${userName}`;
    const pageDescription = `Conversation between ${conversation.character} and ${userName}`;

    // TODO: have a different og image
    const pageOgImage = `/images/characters/${conversation.character}-og.png`;

    return { conversation, pageTitle, pageDescription, pageOgImage };
}) satisfies PageServerLoad;