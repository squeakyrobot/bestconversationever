import { GOOGLE_OAUTH_CLIENT_SECRET, SESSION_COOKIE_NAME } from '$env/static/private';
import { LoginTicket, OAuth2Client } from 'google-auth-library';
import { PUBLIC_GOOGLE_OAUTH_CLIENT_ID } from '$env/static/public';
import { RedisClient } from '$lib/server/redis';
import { assert } from '$lib/assert';
import { createFromAuthInfo, type AuthenticatorInfo, updateFromAuthInfo } from '$lib/server/user-account';
import { packSession } from '$lib/server/session-utils';
import { redirect, type RequestHandler } from '@sveltejs/kit';
import { characterExists } from '$lib/personality';

export const GET: RequestHandler = async ({ url, locals, cookies }) => {

    const redirectURL = `${url.origin}/auth/response/google`;
    const code = await url.searchParams.get('code');
    const state = await url.searchParams.get('state');

    try {
        assert(code, 'No code received');

        const client = new OAuth2Client(
            PUBLIC_GOOGLE_OAUTH_CLIENT_ID,
            GOOGLE_OAUTH_CLIENT_SECRET,
            redirectURL,
        );

        const response = await client.getToken(code);
        client.setCredentials(response.tokens);
        const userTokens = client.credentials;


        assert(userTokens.id_token, 'No id token provided by Google auth');

        const ticket = await client.verifyIdToken({
            idToken: userTokens.id_token,
            requiredAudience: PUBLIC_GOOGLE_OAUTH_CLIENT_ID,
        }) as unknown as LoginTicket;

        assert(ticket && ticket instanceof LoginTicket, 'Unable to verify id token');

        const payload = ticket.getPayload();
        const googleUserId = ticket.getUserId();

        assert(googleUserId, 'Unable to get Google user id');
        assert(payload, 'Unable to get auth payload');

        const authInfo: AuthenticatorInfo = {
            authenticator: 'google',
            email: payload.email,
            emailVerified: payload.email_verified || false,
            id: googleUserId,
            name: payload.name || undefined,
            picture: payload.picture || undefined,
        }

        const redisCLient = new RedisClient();

        let userAccount = await redisCLient.findUserAccount(authInfo);


        if (userAccount) {
            userAccount = updateFromAuthInfo(userAccount, authInfo);
        }
        else {
            userAccount = createFromAuthInfo(locals.session.user, authInfo);
        }

        const accountKey = await redisCLient.saveUserAccount(userAccount);

        assert(accountKey, 'Failed to save the user account');

        // Should it get a new sessin id?
        locals.session.authenticated = true;
        locals.session.accountId = userAccount.id;
        locals.session.authTime = Date.now();
        locals.session.user = userAccount.user;

        cookies.set(SESSION_COOKIE_NAME,
            await packSession(locals.session), { path: '/', expires: new Date(locals.session.expires) });

    }
    catch (e) {
        console.error(e);
        throw e;
    }

    const redirectUrl = (state && characterExists(state)) ? `/chat/${state}` : '/inbox';

    throw redirect(303, redirectUrl);
};