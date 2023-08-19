import type { RequestHandler } from './$types';
import type { UserSettings } from '$lib/user';
import { getSession, packSession, type Session } from '$lib/session';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, cookies }) => {
    try {
        const updatedSettings = await request.json() as UserSettings
        const sessionData = cookies.get('session');
        const session = getSession(sessionData) as Session;

        session.user.settings = updatedSettings;

        console.log(session);

        cookies.set('session', packSession(session), { path: '/', expires: new Date(session.expires) });

        return json({ success: true });
    }
    catch (e) {
        console.error('Failed to update settings', e);
        return json({ success: false });
    }
};