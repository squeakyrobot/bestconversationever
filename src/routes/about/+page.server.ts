import { assert } from "$lib/assert";
import type { Actions } from "@sveltejs/kit";
import { getErrorMessage } from "$lib/util";
import type { PageServerLoad } from "./$types";
import { Resend } from 'resend';
import { RESEND_API_KEY } from "$env/static/private";
import { verifyRecaptcha } from "$lib/server/recaptcha-verify";
import { scoreThresholds } from "$lib/recaptcha-client";

export const load = (({ cookies }) => {

    const formSubmitted = !!cookies.get('BCEM');

    return {
        formSubmitted,
        pageTitle: 'About having the best conversation ever',
        pageDescription: 'Learn more about the site',
    };
}) satisfies PageServerLoad;

export const actions = {
    default: async ({ request, cookies }) => {
        try {
            const formData = await request.formData();
            const email = formData.get('email');
            assert(email, 'Email is required');

            const subject = formData.get('subject');
            assert(subject, 'Subject is required');

            const message = formData.get('message');
            assert(message, 'Message is required');

            const token = formData.get('token');
            assert(token, 'Verification failed');

            const response = await verifyRecaptcha(token.toString());

            assert(response.score > scoreThresholds.contactForm, 'Verification failed. Are you a bot?');

            const resend = new Resend(RESEND_API_KEY);

            await resend.emails.send({
                from: 'bce-info@squeakyrobot.com',
                to: 'bce-info@squeakyrobot.com',
                subject: `BCE CONTACT FORM: ${subject.toString()}`,
                text: `From: ${email}\n\n${message.toString()}`,
            });


            cookies.set('BCEM', "1", { path: '/', expires: new Date(Date.now() + 8.64e+7) });

            return { success: true }
        }
        catch (e) {
            return { success: false, message: getErrorMessage(e) };
        }
    }
} satisfies Actions