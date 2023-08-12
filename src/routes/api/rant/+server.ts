import { OPENAI_API_KEY } from '$env/static/private';
import { Configuration, OpenAIApi, type ChatCompletionRequestMessage } from 'openai';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { buildQuery, } from '$lib/server/query';
import { Personality } from '$lib/query-options';
import type { RantRequest } from '$lib/rant-request';
import type { RantResponse } from '$lib/rant-response';
// import type { Config } from '@sveltejs/adapter-vercel';

// export const config: Config = {
//   runtime: 'edge'
// };

export const POST: RequestHandler = async ({ request }) => {
    const rantTime = new Date();
    // TODO: Check API key and throw appropriate error

    // Get request data
    const rantRequest = await request.json() as RantRequest;

    // TODO: Validate request data

    // TODO: check rant

    // TODO: Use moderation API to check that the rant is allowed


    const query = buildQuery(rantRequest);
    const personName = Object.keys(Personality)[Object.values(Personality).indexOf(query.personality)];

    const messages: ChatCompletionRequestMessage[] = [
        { role: 'system', content: query.system }
    ];

    if (rantRequest.previousMessages) {
        messages.push(...rantRequest.previousMessages)
    }

    messages.push({ role: 'user', content: query.prompt });

    // TODO: Count tokens, error on too large of a query


    // Do OPen API Call
    const configuration = new Configuration({
        apiKey: OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);

    const chatCompletion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages,
    });


    const response = chatCompletion.data.choices[0].message?.content || 'I have nothing to say.'

    const rantResponse: RantResponse = {
        personName,
        response,
        responseTime: new Date(),
        personality: query.personality,
        mood: query.mood,
        relationship: query.relationship,
        rantTime,
    }


    return json(rantResponse);
};


    // try {
    //     if (!OPENAI_KEY) {
    //         throw new Error('OPENAI_KEY env variable not set');
    //     }

    //     const requestData = await request.json();

    //     if (!requestData) {
    //         throw new Error('No request data');
    //     }

    //     const reqMessages: ChatCompletionRequestMessage[] = requestData.messages;

    //     if (!reqMessages) {
    //         throw new Error('no messages provided');
    //     }

    //     let tokenCount = 0;

    //     reqMessages.forEach((msg) => {
    //         const tokens = getTokens(msg.content || '');
    //         tokenCount += tokens;
    //     });

    //     const moderationRes = await fetch('https://api.openai.com/v1/moderations', {
    //         headers: {
    //             'Content-Type': 'application/json',
    //             Authorization: `Bearer ${OPENAI_KEY}`
    //         },
    //         method: 'POST',
    //         body: JSON.stringify({
    //             input: reqMessages[reqMessages.length - 1].content
    //         })
    //     });

    //     const moderationData = await moderationRes.json();
    //     const [results] = moderationData.results;

    //     if (results.flagged) {
    //         throw new Error('Query flagged by openai');
    //     }

    //     const prompt =
    //         'You are a virtual assistant for a company called Huntabyte. Your name is Axel Smith';
    //     tokenCount += getTokens(prompt);

    //     if (tokenCount >= 4000) {
    //         throw new Error('Query too large');
    //     }

    //     const messages: ChatCompletionRequestMessage[] = [
    //         { role: 'system', content: prompt },
    //         ...reqMessages
    //     ];

    //     const chatRequestOpts: CreateChatCompletionRequest = {
    //         model: 'gpt-3.5-turbo',
    //         messages,
    //         temperature: 0.9,
    //         stream: true
    //     };

    //     const chatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    //         headers: {
    //             Authorization: `Bearer ${OPENAI_KEY}`,
    //             'Content-Type': 'application/json'
    //         },
    //         method: 'POST',
    //         body: JSON.stringify(chatRequestOpts)
    //     });

    //     if (!chatResponse.ok) {
    //         const err = await chatResponse.json();
    //         throw new Error(err);
    //     }

    //     return new Response(chatResponse.body, {
    //         headers: {
    //             'Content-Type': 'text/event-stream'
    //         }
    //     });
    // } catch (err) {
    //     console.error(err);
    //     return json({ error: 'There was an error processing your request' }, { status: 500 });
    // }
