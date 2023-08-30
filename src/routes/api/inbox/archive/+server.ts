import type { RequestHandler } from './$types';
import { RECAPTCHA_ENABLED } from '$env/static/private';
import { RedisClient } from '$lib/server/redis';
import { assert } from '$lib/assert';
import { json } from '@sveltejs/kit';
import { scoreThresholds } from '$lib/recaptcha-client';
import { verifyRecaptcha } from '$lib/server/recaptcha-verify';

export const POST: RequestHandler = async ({ locals, request }) => {
    try {
        const reqBody = await request.json() as {
            action: 'archive' | 'unarchive',
            recaptchaToken: string,
            conversationId: string
        };

        if (RECAPTCHA_ENABLED !== "0") {
            assert(reqBody.recaptchaToken, 'No Recaptcha Token Provided');

            const response = await verifyRecaptcha(reqBody.recaptchaToken);

            assert(response.success, 'Recaptcha verification failed');
            assert(response.score >= scoreThresholds.chat, 'Are you a bot?\nRecaptcha score too low.');
        }
        const redis = new RedisClient(locals.session);
        const conversation = await redis.getConversation(reqBody.conversationId);

        assert(conversation, `Could not find conversatin to ${reqBody.action}`);
        assert(conversation.userId === locals.session.user.id, `Cannot ${reqBody.action} conversations for other users`);

        if (reqBody.action === 'archive') {
            await redis.archiveConversation(conversation);
        }
        else {
            await redis.unarchiveConversation(conversation);
        }

        return json({ success: true });
    }
    catch (e) {
        console.error('Failed to archive conversation', e);
        return json({ success: false });
    }
};