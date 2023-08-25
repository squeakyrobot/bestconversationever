import type { RequestHandler } from './$types';
import type { UserSettings } from '$lib/user';
import { getSession, packSession, type Session } from '$lib/session';
import { json } from '@sveltejs/kit';
import { SESSION_COOKIE_NAME } from '$env/static/private';

export const POST: RequestHandler = async ({ request, cookies, locals }) => {
    try {
        const updatedSettings = await request.json() as UserSettings

        locals.session.user.settings = updatedSettings;

        console.log('Settings Udate: Updated (SET)', locals.session);
        cookies.set(SESSION_COOKIE_NAME,
            packSession(locals.session), { path: '/', expires: new Date(locals.session.expires) });

        return json({ success: true });

    }
    catch (e) {
        console.error('Failed to update settings', e);
        return json({ success: false });
    }
};