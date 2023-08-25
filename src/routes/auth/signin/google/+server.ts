import { GOOGLE_OAUTH_CLIENT_SECRET } from "$env/static/private";
import { PUBLIC_GOOGLE_OAUTH_CLIENT_ID } from "$env/static/public";
import { redirect, type RequestHandler } from "@sveltejs/kit";
import { OAuth2Client } from "google-auth-library";


export const GET: RequestHandler = async ({ url }) => {
    const redirectURL = `${url.origin}/auth/response/google`;
    console.log('Redirect Url: ' + redirectURL);

    const oAuth2Client = new OAuth2Client(
        PUBLIC_GOOGLE_OAUTH_CLIENT_ID,
        GOOGLE_OAUTH_CLIENT_SECRET,
        redirectURL
    );

    // Generate the url that will be used for the consent dialog.
    const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: 'https://www.googleapis.com/auth/userinfo.profile  openid ',
        prompt: 'consent',
        redirect_uri: redirectURL,
    });

    throw redirect(302, authorizeUrl);
}