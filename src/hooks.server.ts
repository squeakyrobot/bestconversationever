import type { Handle } from "@sveltejs/kit";
import { SESSION_COOKIE_NAME } from "$env/static/private";
import { getSession, packSession } from "$lib/session";

const securityHeaders = {
    'cross-origin-embedder-policy': 'require-corp',
    'cross-origin-opener-policy': 'same-origin',
    'cross-origin-resource-policy': 'same-origin',
    'origin-agent-cluster': '?1',
    'referrer-policy': 'no-referrer',
    'strict-transport-security': 'max-age=15552000; includeSubDomains',
    'x-content-type-options': 'nosniff',
    'x-dns-prefetch-control': 'off',
    'x-download-options': 'noopen',
    'x-frame-options': 'SAMEORIGIN',
    'x-permitted-cross-domain-policies': 'none',
    'x-xss-protection': '0',
    'x-powered-by': 'best-conversation-ever',
} as const;

export const handle: Handle = async ({ event, resolve }) => {
    // Session Management
    const { cookies, locals } = event;

    const sessionData = cookies.get(SESSION_COOKIE_NAME);
    locals.session = getSession(sessionData);

    cookies.set(SESSION_COOKIE_NAME, packSession(locals.session), { path: '/', expires: new Date(locals.session.expires) });

    const response = await resolve(event);

    // Security Headers
    Object.entries(securityHeaders).forEach(
        ([header, value]) => response.headers.set(header, value)
    );

    if (process.env.VERCEL_ENV !== 'production') {
        response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    }

    return response;
}