import { RECAPTCHA_SECRET_KEY } from "$env/static/private";
import type { RecaptchaVerifyResponse } from "$lib/recaptcha-client";


export async function verifyRecaptcha(token: string): Promise<RecaptchaVerifyResponse> {
    // const remoteip = undefined;

    const apiCall = await fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${token}`, {
        method: 'POST',
    });

    const apiResponse = await apiCall.json() as RecaptchaVerifyResponse;

    // TODO: validate response

    return apiResponse;
}

