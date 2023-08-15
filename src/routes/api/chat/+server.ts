import { OPENAI_API_KEY, CHAT_CONTEXT_MESSAGE_COUNT } from '$env/static/private';
import { Configuration, OpenAIApi, type ChatCompletionRequestMessage } from 'openai';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { buildChatQuery, } from '$lib/server/query';
import type { ChatApiRequest } from '$lib/chat-api-request';
import type { ChatApiResponse } from '$lib/chat-api-response';
import type { ConversationItem } from '$lib/stores/conversation';
import { verifyRecaptcha } from '$lib/server/recaptcha-verify';
import { scoreThresholds } from '$lib/recaptcha-client';

// import type { Config } from '@sveltejs/adapter-vercel';

// export const config: Config = {
//   runtime: 'edge'
// };

export const POST: RequestHandler = async ({ request }) => {
    let isValidRequest = true;
    let errorMessage = '';

    const contextMessageCount = CHAT_CONTEXT_MESSAGE_COUNT ? parseInt(CHAT_CONTEXT_MESSAGE_COUNT, 10) : 6

    // TODO: Check API key and throw appropriate error

    // Get request data
    const apiRequest = await request.json() as ChatApiRequest;

    // TODO: Validate request data

    if (apiRequest.recaptchaToken) {
        const response = await verifyRecaptcha(apiRequest.recaptchaToken);

        if (response.score < scoreThresholds.chat) {
            // TODO: Have a fun way of sending errors, perhaps a system user can send a message.
            isValidRequest = false;
            errorMessage = 'Are you a bot?\n```' + JSON.stringify(response, null, 4) + '```';
        }
    } else {
        isValidRequest = false;
        errorMessage = 'Cannot chat: Security Token Missing';
    }

    // TODO: check chat message 

    // TODO: Use moderation API to check that the rant is allowed


    if (isValidRequest) {
        const query = buildChatQuery(apiRequest);
        // const personName = Object.keys(Personality)[Object.values(Personality).indexOf(query.personality)];

        const messages: ChatCompletionRequestMessage[] = [
            { role: 'system', content: query.system }
        ];

        if (apiRequest.previousMessages) {

            if (apiRequest.previousMessages.length > contextMessageCount) {

                apiRequest.previousMessages.splice(0, apiRequest.previousMessages.length - contextMessageCount);
            }

            messages.push(...apiRequest.previousMessages.map<ChatCompletionRequestMessage>(
                (value: ConversationItem) => {
                    return { role: value.role, content: value.text };
                })
            );
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


        const message = chatCompletion.data.choices[0].message?.content || 'I have nothing to say.';

        // TODO: store the data in the DB

        return json({
            requestId: apiRequest.id,
            conversationId: apiRequest.conversationId,
            personality: apiRequest.personality,
            message,
            time: new Date(),
        } as ChatApiResponse);
    }
    else {
        return json({
            requestId: apiRequest.id,
            conversationId: apiRequest.conversationId,
            personality: apiRequest.personality,
            message: errorMessage || 'An error occurred',
            time: new Date(),
        } as ChatApiResponse);
    }

};
