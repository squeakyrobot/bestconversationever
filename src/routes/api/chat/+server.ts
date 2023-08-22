import {
    CHAT_CONTEXT_MESSAGE_COUNT,
    MAX_CHAT_MESSAGE_TOKENS,
    MAX_REQUEST_TOKENS,
    MAX_RESPONSE_TOKENS,
    OPENAI_API_KEY,
    RECAPTCHA_ENABLED,
    USE_DB,
} from '$env/static/private';
import type { ChatApiRequest } from '$lib/chat-api-request';
import type { ChatApiResponse } from '$lib/chat-api-response';
import type { Conversation, ConversationItem } from '$lib/stores/conversation';
import type { RequestHandler } from './$types';
import { Character, Personality } from '$lib/personality';
import { Configuration, OpenAIApi, type ChatCompletionRequestMessage } from 'openai';
import { RedisClient } from '$lib/server/redis';
import { assert } from '$lib/assert';
import { buildChatQuery, type QueryResult, } from '$lib/server/query';
import { estimateGptTokens } from '$lib/token-estimator';
import { getErrorMessage } from '$lib/util';
import { json } from '@sveltejs/kit';
import { scoreThresholds } from '$lib/recaptcha-client';
import { verifyRecaptcha } from '$lib/server/recaptcha-verify';

export const POST: RequestHandler = async ({ request, locals }) => {

    const maxChatTokens = parseInt(MAX_CHAT_MESSAGE_TOKENS || '500', 10);
    const maxResponseTokens = parseInt(MAX_RESPONSE_TOKENS || '300', 10);

    // Get request data
    const apiRequest = await request.json() as ChatApiRequest;


    try {
        if (!OPENAI_API_KEY) {
            throw new Error('No API Key');
        }
        // TODO: Validate request data

        if (RECAPTCHA_ENABLED !== "0") {
            assert(apiRequest.recaptchaToken, 'No Recaptcha Token Provided');

            const response = await verifyRecaptcha(apiRequest.recaptchaToken);

            assert(response.success, 'Recaptcha verification failed');
            assert(response.score >= scoreThresholds.chat, 'Are you a bot?\nRecaptcha score too low.');
        }

        // TODO: Use moderation API to check the data for safe mode
        // off for now because the adult language is funnier anyway


        const query = buildChatQuery(apiRequest, locals.session.user.settings);
        assert(query.promptTokens <= maxChatTokens, 'Chat too long, try something shorter.');

        const messages: ChatCompletionRequestMessage[] = createChatGptMessages(query, apiRequest);

        // Do Open API Call
        const configuration = new Configuration({
            apiKey: OPENAI_API_KEY,
        });

        const openai = new OpenAIApi(configuration);

        const chatCompletion = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages,
            max_tokens: maxResponseTokens,
        });


        const message = chatCompletion.data.choices[0].message?.content || 'I have nothing to say.';

        const apiResponse = {
            requestId: apiRequest.id,
            conversationId: apiRequest.conversationId,
            personality: apiRequest.personality,
            isSystemMessage: false,
            message,
            time: new Date(),
            sharable: false,
            responseTokens: chatCompletion.data.usage?.completion_tokens,
            totalTokens: chatCompletion.data.usage?.total_tokens,
        } as ChatApiResponse;


        const convo: Conversation = createConversation(locals, apiRequest, apiResponse)

        // TODO: handle db errors - This simply returns false if the save fails
        const saved = (USE_DB !== '0') ? await (new RedisClient()).saveConversation(convo) : false;

        apiResponse.sharable = saved;

        return json(apiResponse);
    }
    catch (error) {
        const message = getErrorMessage(error);

        return json({
            requestId: apiRequest.id || 'NO_ID',
            conversationId: apiRequest.conversationId || 'NO_ID',
            personality: apiRequest.personality || (new Personality({ character: Character.Elvis })).export(),
            isSystemMessage: true,
            sharable: false,
            message: message || 'An error occurred',
            time: new Date(),
        } as ChatApiResponse);
    }
};


function createChatGptMessages(query: QueryResult, apiRequest: ChatApiRequest) {
    const maxRequestTokens = parseInt(MAX_REQUEST_TOKENS || "2000", 10);
    const contextMessageCount = parseInt(CHAT_CONTEXT_MESSAGE_COUNT || "10", 10);

    const messages: ChatCompletionRequestMessage[] = [
        { role: 'system', content: query.system }
    ];

    if (apiRequest.previousMessages) {
        const prevMessages = apiRequest.previousMessages;

        // Remove any messages as needed so we don't exceed the CHAT_CONTEXT_MESSAGE_COUNT
        if (prevMessages.length > contextMessageCount) {
            prevMessages.splice(0, prevMessages.length - contextMessageCount);
        }

        let prevMsgTokens = estimateGptTokens(prevMessages.map(v => v.text || ''));

        // If we are over the MAX_REQUEST_TOKENS limit, remove messages until we are under
        while (prevMsgTokens + query.promptTokens > maxRequestTokens + query.systemTokens) {
            prevMessages.splice(0, 1);
            prevMsgTokens = estimateGptTokens(prevMessages.map(v => v.text || ''));
        }

        messages.push(...prevMessages.map<ChatCompletionRequestMessage>(
            (value: ConversationItem) => {
                return { role: value.role, content: value.text };
            })
        );
    }

    messages.push({ role: 'user', content: query.prompt });

    return messages;
}

function createConversation(locals: App.Locals, apiRequest: ChatApiRequest, apiResponse: ChatApiResponse): Conversation {
    return {
        userId: locals.session.user.id,
        userName: apiRequest.userName,
        character: apiRequest.personality.name,
        conversationId: apiRequest.conversationId,
        shareable: true,
        messages: [
            {
                requestId: apiRequest.id,
                role: 'user',
                name: apiRequest.userName,
                time: apiRequest.time,
                text: apiRequest.message,
                waitingForResponse: false,
            },
            {
                requestId: apiRequest.id,
                role: 'assistant',
                name: apiResponse.personality.name,
                time: apiResponse.time,
                text: apiResponse.message,
                waitingForResponse: false,
            }
        ]
    };
}

