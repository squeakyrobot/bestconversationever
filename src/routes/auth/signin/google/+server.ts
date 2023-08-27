import { GOOGLE_OAUTH_CLIENT_SECRET } from "$env/static/private";
import { PUBLIC_GOOGLE_OAUTH_CLIENT_ID } from "$env/static/public";
import { characterExists } from "$lib/personality";
import { redirect, type RequestHandler } from "@sveltejs/kit";
import { OAuth2Client } from "google-auth-library";


export const GET: RequestHandler = async ({ url, params }) => {
    const redirectURL = `${url.origin}/auth/response/google`;
    const stateParam = await url.searchParams.get('state');
    let state: string | undefined;

    if (stateParam && characterExists(stateParam)) {
        state = stateParam.toLowerCase();
    }

    const oAuth2Client = new OAuth2Client(
        PUBLIC_GOOGLE_OAUTH_CLIENT_ID,
        GOOGLE_OAUTH_CLIENT_SECRET,
        redirectURL
    );

    // Generate the url that will be used for the consent dialog.
    const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid',
        prompt: 'consent',
        redirect_uri: redirectURL,
        state,
    });

    throw redirect(302, authorizeUrl);
}
