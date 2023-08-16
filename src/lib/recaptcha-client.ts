import { PUBLIC_RECAPTCHA_SITE_KEY } from "$env/static/public";

// TODO: figure out good thresholds and a way to update them
export const scoreThresholds = {
    homePage: 0.5,
    chat: 0.5,
} as const;

export type ErrorCodes = 'missing-input-secret' | 'invalid-input-secret' | 'missing-input-response' |
    'invalid-input-response' | 'bad-request' | 'timeout-or-duplicate';

export interface RecaptchaVerifyResponse {
    success: boolean;       // whether this request was a valid reCAPTCHA token for your site
    score: number;          // the score for this request (0.0 - 1.0)
    action: string;         // the action name for this request (important to verify)
    challenge_ts: string;   // timestamp of the challenge load (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
    hostname: string;       // the hostname of the site where the reCAPTCHA was solved
    'error-codes'?: ErrorCodes[];
}

export interface RecaptchaVerifyRequest {
    action: string;
    token: string;
}

export async function recaptchaVerify(action: string): Promise<RecaptchaVerifyResponse> {
    const token = await getRecaptchaToken(action);

    const apiCall = await fetch('/api/recaptcha', {
        method: 'POST',
        body: JSON.stringify({ action, token } as RecaptchaVerifyRequest),
    });

    const apiResponse = await apiCall.json() as RecaptchaVerifyResponse;

    return apiResponse;
}

export async function getRecaptchaToken(action: string): Promise<string> {
    return new Promise((resolve, reject) => {
        try {
            grecaptcha.ready(() => {
                grecaptcha
                    .execute(PUBLIC_RECAPTCHA_SITE_KEY, { action })
                    .then((token: string) => {
                        resolve(token);
                    });
            });
        }
        catch (e) {
            reject(e);
        }
    })
}

export function handlePageRecaptcha(response: RecaptchaVerifyResponse): void {
    // TODO: add appropriate behavior, whatever that is

    if (response.score < scoreThresholds.homePage) {
        console.log('BOT ALERT!!!');
    }
}
