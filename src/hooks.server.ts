
export async function handle({ event, resolve }) {
    const response = await resolve(event);

    if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview') {
        response.headers.set('X-Robots-Tag', 'noindex');
    }

    return response;
}