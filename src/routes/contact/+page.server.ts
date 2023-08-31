import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { CONTACT_EMAIL, CONTACT_SENT_COOKIE_NAME, RESEND_API_KEY } from "$env/static/private";
import { Resend } from 'resend';
import { assert } from "$lib/assert";
import { getErrorMessage } from "$lib/util";
import { scoreThresholds } from "$lib/recaptcha-client";
import { verifyRecaptcha } from "$lib/server/recaptcha-verify";

export const load = (({ cookies, locals }) => {

    const formSubmitted = !!cookies.get(CONTACT_SENT_COOKIE_NAME);

    return {
        user: locals.session.user,
        formSubmitted,
        pageTitle: 'Contact Us',
        pageDescription: 'Got a technical issue? Want to send feedback about your experience? Leave us a message.',
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
                from: CONTACT_EMAIL,
                to: CONTACT_EMAIL,
                subject: `CONTACT FORM: ${subject.toString()}`,
                text: `From: ${email}\n\n${message.toString()}`,
            });


            cookies.set(CONTACT_SENT_COOKIE_NAME, "1", { path: '/', expires: new Date(Date.now() + 8.64e+7) });

            return { success: true }
        }
        catch (e) {
            return { success: false, message: getErrorMessage(e) };
        }
    }
} satisfies Actions