import { SESSION_COOKIE_NAME } from "$env/static/private";
import { getSession, packSession } from "$lib/server/session-utils";
import { redirect, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ locals, cookies }) => {
    locals.session = await getSession();

    cookies.set(SESSION_COOKIE_NAME, await packSession(locals.session), { path: '/', expires: new Date(locals.session.expires) });

    throw redirect(302, '/');
}
