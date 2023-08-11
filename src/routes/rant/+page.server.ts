
import type { PageServerLoad, Actions } from './$types';
import { buildQuery } from '$lib/server/query';
import { Personality, getRandomPersonality } from '$lib/query-options';
import { OPENAI_API_KEY } from '$env/static/private';
import { Configuration, OpenAIApi } from 'openai';
import type { RantResponse } from '$lib/rant-response';

// let prompt = '';
// let rant = '';
// let personName = '';
// let response = '';

export const load = (async (event) => {
    return {};
}) satisfies PageServerLoad;

export const actions = {

    getResponse: async ({ request }): Promise<RantResponse> => {
        const rantTime = new Date();
        // TODO: Check API key and throw appropriate error

        // Get request data
        const formData = await request.formData();
        const rant = formData.get('rant') as string;
        // TODO: check rant

        // TODO: Use moderation API to check that the rant is allowed


        // TODO: Allow a specified personality
        const personality = getRandomPersonality();

        const query = buildQuery({ rant, personality });
        const personName = Object.keys(Personality)[Object.values(Personality).indexOf(personality)];

        // TODO: Count tokens, error on too large of a query


        // Do OPen API Call
        const configuration = new Configuration({
            apiKey: OPENAI_API_KEY,
        });

        const openai = new OpenAIApi(configuration);

        const chatCompletion = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'system', content: query.system }, { role: 'user', content: query.prompt }],
        });

        const response = chatCompletion.data.choices[0].message?.content || 'I have nothing to say.'

        const prompt = query.system;

        return { personName, response, responseTime: new Date(), prompt, rant, rantTime };
    }
} satisfies Actions