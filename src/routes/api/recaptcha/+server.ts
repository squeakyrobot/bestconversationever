import type { RecaptchaVerifyRequest } from '$lib/recaptcha-client';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { verifyRecaptcha } from '$lib/server/recaptcha-verify';

export const POST: RequestHandler = async ({ request }) => {

    // TODO: Verify input, validate response, log result
    const apiRequest = await request.json() as RecaptchaVerifyRequest;

    const response = await verifyRecaptcha(apiRequest.token);

    return json(response);
};