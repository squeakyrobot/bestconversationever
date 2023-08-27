import type { RequestHandler } from './$types';
import type { UserSettings } from '$lib/user';
import { packSession } from '$lib/server/session-utils';
import { SESSION_COOKIE_NAME } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { RedisClient } from '$lib/server/redis';

export const POST: RequestHandler = async ({ request, cookies, locals }) => {
    try {
        // TODO: add recaptcha verification

        const updatedSettings = await request.json() as UserSettings

        locals.session.user.settings = updatedSettings;

        if (locals.session.authenticated) {
            const redis = new RedisClient(locals.session);
            await redis.updateUserSettings(locals.session.accountId, updatedSettings);
        }

        cookies.set(SESSION_COOKIE_NAME,
            await packSession(locals.session), { path: '/', expires: new Date(locals.session.expires) });

        return json({ success: true });

    }
    catch (e) {
        console.error('Failed to update settings', e);
        return json({ success: false });
    }
};