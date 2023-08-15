import type { RecaptchaVerifyRequest } from '$lib/recaptcha-client';
import { verifyRecaptcha } from '$lib/server/recaptcha-verify';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {

    // TODO: Verify input, validate response, log result
    const apiRequest = await request.json() as RecaptchaVerifyRequest;

    const response = await verifyRecaptcha(apiRequest.token);

    return json(response);
};