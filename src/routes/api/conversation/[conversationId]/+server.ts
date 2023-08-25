import type { RequestHandler } from './$types';
import { RedisClient } from '$lib/server/redis';
import { error, json } from '@sveltejs/kit';
import { assert } from '$lib/assert';
import { RECAPTCHA_ENABLED } from '$env/static/private';
import { verifyRecaptcha } from '$lib/server/recaptcha-verify';
import { scoreThresholds } from '$lib/recaptcha-client';

export const POST: RequestHandler = async ({ locals, params, request }) => {
    try {
        const reqBody = await request.json() as { recaptchaToken: string };

        if (RECAPTCHA_ENABLED !== "0") {
            assert(reqBody.recaptchaToken, 'No Recaptcha Token Provided');

            const response = await verifyRecaptcha(reqBody.recaptchaToken);

            assert(response.success, 'Recaptcha verification failed');
            assert(response.score >= scoreThresholds.chat, 'Are you a bot?\nRecaptcha score too low.');
        }

        const conversationId = params.conversationId;
        assert(conversationId, 'Missing conversationId');

        const redis = new RedisClient();
        const convo = await redis.getConversation(conversationId);

        assert(convo, error(404, 'Conversation not found'));
        assert(convo.userId === locals.session.user.id, error(403, 'Forbidden'));

        return json(convo);
    }
    catch (e) {
        console.error(e);
        throw e;
    }
};