import { GOOGLE_OAUTH_CLIENT_SECRET, SESSION_COOKIE_NAME } from '$env/static/private';
import { PUBLIC_GOOGLE_OAUTH_CLIENT_ID } from '$env/static/public';
import { assert } from '$lib/assert';
import { packSession } from '$lib/server/session-utils';
import { UserType } from '$lib/user';
import { redirect, type RequestHandler } from '@sveltejs/kit';
import { LoginTicket, OAuth2Client } from 'google-auth-library';



export const GET: RequestHandler = async ({ url, locals, cookies }) => {

    const redirectURL = `${url.origin}/auth/response/google`;
    const code = await url.searchParams.get('code');

    try {
        assert(code, 'No code received');

        const client = new OAuth2Client(
            PUBLIC_GOOGLE_OAUTH_CLIENT_ID,
            GOOGLE_OAUTH_CLIENT_SECRET,
            redirectURL,
        );

        const response = await client.getToken(code);
        client.setCredentials(response.tokens);
        const user = client.credentials;

        assert(user.id_token, 'No id token provided');

        const ticket = await client.verifyIdToken({
            idToken: user.id_token,
            requiredAudience: PUBLIC_GOOGLE_OAUTH_CLIENT_ID,
        }) as unknown as LoginTicket;

        assert(ticket && ticket instanceof LoginTicket);
        const payload = ticket.getPayload();

        console.log(payload);

        console.log(user);

        // TODO: Log them in!!!!!

        locals.session.user.type = UserType.Authenticated;
        locals.session.user.name = payload?.name || '';
        locals.session.user.avatarUrl = payload?.picture || '';

        cookies.set(SESSION_COOKIE_NAME,
            await packSession(locals.session), { path: '/', expires: new Date(locals.session.expires) });



        // {
        //     iss: 'https://accounts.google.com',
        //     azp: '513691672899-lev6dshj5k4vslq4pvh5nbte5q6uql62.apps.googleusercontent.com',
        //     aud: '513691672899-lev6dshj5k4vslq4pvh5nbte5q6uql62.apps.googleusercontent.com',
        //     sub: '103666588557881622017',
        //     at_hash: 'DdluQkaMX3KWZQ12Wtmsdw',
        //     name: 'Ryan Cook',
        //     picture: 'https://lh3.googleusercontent.com/a/AAcHTtdHquP6fWrXhUdHlQvaT85S0-ryluf8kOILtnJ8y5X_mgxy=s96-c',
        //     given_name: 'Ryan',
        //     family_name: 'Cook',
        //     locale: 'en',
        //     iat: 1693007573,
        //     exp: 1693011173
        //   }

    }
    catch (e) {
        console.error(e);
    }

    throw redirect(303, '/inbox');

};