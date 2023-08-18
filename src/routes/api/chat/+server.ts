import {
    CHAT_CONTEXT_MESSAGE_COUNT,
    MAX_CHAT_MESSAGE_TOKENS,
    MAX_REQUEST_TOKENS,
    MAX_RESPONSE_TOKENS,
    OPENAI_API_KEY,
    RECAPTCHA_ENABLED,
} from '$env/static/private';
import type { ChatApiRequest } from '$lib/chat-api-request';
import type { ChatApiResponse } from '$lib/chat-api-response';
import type { Conversation, ConversationItem } from '$lib/stores/conversation';
import type { RequestHandler } from './$types';
import { Character, Personality } from '$lib/personality';
import { Configuration, OpenAIApi, type ChatCompletionRequestMessage } from 'openai';
import { assert } from '$lib/assert';
import { buildChatQuery, } from '$lib/server/query';
import { estimateGptTokens } from '$lib/token-estimator';
import { getErrorMessage } from '$lib/util';
import { json } from '@sveltejs/kit';
import { kv } from '@vercel/kv';
import { scoreThresholds } from '$lib/recaptcha-client';
import { verifyRecaptcha } from '$lib/server/recaptcha-verify';
import { generateChatKey, redisKeyExists } from '$lib/server/redis';

export const POST: RequestHandler = async ({ request, locals }) => {
    const contextMessageCount = CHAT_CONTEXT_MESSAGE_COUNT ? parseInt(CHAT_CONTEXT_MESSAGE_COUNT, 10) : 6;
    const maxChatTokens = MAX_CHAT_MESSAGE_TOKENS ? parseInt(MAX_CHAT_MESSAGE_TOKENS, 10) : 500;
    const maxRequestTokens = MAX_REQUEST_TOKENS ? parseInt(MAX_REQUEST_TOKENS, 10) : 2000;
    const maxResponseTokens = MAX_RESPONSE_TOKENS ? parseInt(MAX_RESPONSE_TOKENS, 10) : 300;

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


        const query = buildChatQuery(apiRequest);
        const queryTokens = estimateGptTokens(query.prompt);
        assert(queryTokens <= maxChatTokens, 'Chat too long, try something shorter.');

        const messages: ChatCompletionRequestMessage[] = [
            { role: 'system', content: query.system }
        ];

        if (apiRequest.previousMessages) {
            const prevMessages = apiRequest.previousMessages;

            if (prevMessages.length > contextMessageCount) {
                prevMessages.splice(0, prevMessages.length - contextMessageCount);
            }

            let prevMsgTokens = estimateGptTokens(prevMessages.map(v => v.text || ''));

            while (prevMsgTokens + queryTokens > maxRequestTokens + query.systemTokens) {
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
            responseTokens: chatCompletion.data.usage?.completion_tokens,
            totalTokens: chatCompletion.data.usage?.total_tokens,
        } as ChatApiResponse;

        // TODO: store the data in the DB
        const conversation: Conversation = {
            userId: locals.session.user.id,
            character: apiRequest.personality.name,
            conversationId: apiRequest.conversationId,
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
        }

        const chatKey = generateChatKey(apiRequest);
        const keyExists = await redisKeyExists(chatKey.key);
        const kvPromises: Promise<unknown>[] = [];

        if (keyExists) {
            // append to messages using JSONpath
            kvPromises.push(kv.json.arrappend(chatKey.key, '$.messages', conversation.messages));

        }
        else {
            // create new item and indexes
            kvPromises.push(kv.json.set(chatKey.key, '$', conversation as unknown as Record<string, unknown>));

            for (const item of chatKey.indexes) {
                kvPromises.push(kv.zadd(item.key, { score: item.score, member: item.member }));
            }
        }

        await Promise.all(kvPromises);

        return json(apiResponse);
    }
    catch (error) {
        const message = getErrorMessage(error);

        return json({
            requestId: apiRequest.id || 'NO_ID',
            conversationId: apiRequest.conversationId || 'NO_ID',
            personality: apiRequest.personality || (new Personality({ character: Character.Elvis })).export(),
            isSystemMessage: true,
            message: message || 'An error occurred',
            time: new Date(),
        } as ChatApiResponse);
    }
};
