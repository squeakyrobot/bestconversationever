import type { RequestHandler } from './$types';
import type { UserSettings } from '$lib/user';
import { getSession, packSession, type Session } from '$lib/session';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, cookies }) => {
    try {
        const updatedSettings = await request.json() as UserSettings
        const sessionData = cookies.get('session-v2');
        const session = getSession(sessionData) as Session;

        session.user.settings = updatedSettings;

        cookies.set('session-v2', packSession(session), { path: '/', expires: new Date(session.expires) });

        // NOOP

        return json({ success: true });

    }
    catch (e) {
        console.error('Failed to update settings', e);
        return json({ success: false });
    }
};