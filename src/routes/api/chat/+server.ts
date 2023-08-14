import { OPENAI_API_KEY } from '$env/static/private';
import { Configuration, OpenAIApi, type ChatCompletionRequestMessage } from 'openai';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { buildChatQuery, } from '$lib/server/query';
import type { ChatApiRequest } from '$lib/chat-api-request';
import type { ChatApiResponse } from '$lib/chat-api-response';
import type { ConversationItem } from '$lib/stores/conversation';

// import type { Config } from '@sveltejs/adapter-vercel';

// export const config: Config = {
//   runtime: 'edge'
// };

export const POST: RequestHandler = async ({ request }) => {

    // TODO: Check API key and throw appropriate error

    // Get request data
    const apiRequest = await request.json() as ChatApiRequest;

    // TODO: Validate request data

    // TODO: check rant

    // TODO: Use moderation API to check that the rant is allowed


    const query = buildChatQuery(apiRequest);
    // const personName = Object.keys(Personality)[Object.values(Personality).indexOf(query.personality)];

    const messages: ChatCompletionRequestMessage[] = [
        { role: 'system', content: query.system }
    ];

    if (apiRequest.previousMessages) {
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
};
