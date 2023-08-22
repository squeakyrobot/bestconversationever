# Best Conversation Ever

TODO: Write a real readme

1. Copy `..env.example` to `.env`
2. Add correct values
3. Run `npm run dev`

If you want to skip the Redis setup you can set `USE_DB="0"` But then you cannot share links 
and no data will be saved.

If you want to skip the recaptcha setup you can set `RECAPTCHA_ENABLED="0"` which is probably 
fine for running locally or in a site that no one knows about like this one. But you do run 
a higher risk of bots using up you OpenAI tokens.

If you want to skip setting up [resend](https://resend.com/) then just don't set it up. The 
contact form will fail when submitting.

## Tech Stack
This applicatioin is my first time using all the technologies listed except Google analytics and reCAPTCHA.

* [SvelteKit](https://kit.svelte.dev/)
* [Tailwind CSS](https://tailwindcss.com/)
* [daisyUI](https://daisyui.com/)
* [Redis](https://redis.com/)
* 3rd Pary Services
    * [OpenAI](https://platform.openai.com/docs/api-reference) - For the chat bots
    * [Upstash](https://upstash.com/) - Managed Redis for saving conversations
    * [reCAPTCHA v3](https://www.google.com/recaptcha/about/) - For bot protection
    * [Google Analytics](https://marketingplatform.google.com/about/analytics/) - For site analytics
    * [Resend](https://resend.com/) - For sending contact emails

## Deployment
[BestConversationEver.com](https://bestconversationever.com/) is deployed to [Vercel](https://vercel.com/) and I have been pleased with the experience so far.