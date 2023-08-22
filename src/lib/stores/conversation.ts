import type { ChatApiRequest } from "$lib/chat-api-request";
import type { ChatApiResponse } from "$lib/chat-api-response";
import type { User } from "$lib/user";
import { ChatEvents, sendChatEvent } from "$lib/analytics";
import { PUBLIC_MAX_CLIENT_MESSAGES } from "$env/static/public";
import { Personality } from "$lib/personality";
import { getRecaptchaToken } from "$lib/recaptcha-client";
import { nanoid } from 'nanoid'
import { writable, get, type Writable, type Unsubscriber } from "svelte/store";
import { estimateGptTokens } from "$lib/token-estimator";

const MAX_CLIENT_MESSAGES = PUBLIC_MAX_CLIENT_MESSAGES ? parseInt(PUBLIC_MAX_CLIENT_MESSAGES, 10) : 15;

export type ConversationItem = {
    requestId: string;
    role: 'user' | 'assistant';
    name: string;
    time?: Date;
    text?: string;
    waitingForResponse: boolean;
}

export type Conversation = {
    userId: string;
    character: string;
    conversationId: string;
    shareable: boolean;
    messages: ConversationItem[];
}

export class ConversationStore {
    public store: Writable<Conversation>;
    public conversationId: string;
    private personality: Personality;
    public character: string;
    public shareable: boolean;
    public subscribe: Unsubscriber;

    constructor(private user: User, personality?: Personality) {
        this.personality = personality || new Personality();
        this.conversationId = nanoid(10);
        this.shareable = false;
        this.character = this.personality.export().character;

        this.store = writable<Conversation>({
            userId: this.user.id,
            character: this.character,
            conversationId: this.conversationId,
            shareable: this.shareable,
            messages: []
        });

        this.subscribe = this.store.subscribe;
    }

    public async set(text: string): Promise<void> {

        // Add the user message
        const userMsg: ConversationItem = {
            requestId: nanoid(10),
            name: this.user.name,
            role: 'user',
            time: new Date(),
            waitingForResponse: false,
            text,
        };

        this.store.update((conversation: Conversation) => {
            return {
                userId: this.user.id,
                character: this.character,
                conversationId: this.conversationId,
                shareable: this.shareable,
                messages: [
                    ...conversation.messages,
                    userMsg,
                ]
            };
        });

        const previousMessages = [...get<Conversation>(this.store).messages];

        if (previousMessages.length > MAX_CLIENT_MESSAGES) {
            previousMessages.splice(0, previousMessages.length - MAX_CLIENT_MESSAGES);
        }

        const token = await getRecaptchaToken('chat');

        const apiRequest: ChatApiRequest = {
            id: userMsg.requestId,
            conversationId: this.conversationId,
            userId: this.user.id,
            userName: this.user.name,
            personality: this.personality.export(),
            message: userMsg.text || '',
            time: userMsg.time || new Date(),
            previousMessages,
            recaptchaToken: token,
        };


        const responseMsg: ConversationItem = {
            requestId: userMsg.requestId,
            name: apiRequest.personality.name,
            role: 'assistant',
            waitingForResponse: true,
        };

        this.store.update((conversation: Conversation) => {
            return {
                userId: this.user.id,
                character: this.character,
                conversationId: this.conversationId,
                shareable: this.shareable,
                messages: [
                    ...conversation.messages,
                    responseMsg]
            };
        });

        // This is an estimate based on the MAX_CLIENT_MESSAGES setting, the
        // actual ammount will be based on CHAT_CONTEXT_MESSAGE_COUNT and
        // MAX_REQUEST_TOKENS setting
        const estimatedTokens = estimateGptTokens([text, ...previousMessages.map((m) => m.text || '')]);

        sendChatEvent(ChatEvents.chatSent, { character: apiRequest.personality.name, gptTokens: estimatedTokens });

        const apiCall = await fetch('/api/chat', {
            method: 'POST',
            body: JSON.stringify(apiRequest),
        });

        const apiResponse = await apiCall.json() as ChatApiResponse;


        responseMsg.time = new Date();
        responseMsg.text = apiResponse.message;
        responseMsg.waitingForResponse = false;

        this.shareable = apiResponse.sharable;

        this.store.update((conversation: Conversation) => {
            conversation.messages.pop();
            return {
                userId: this.user.id,
                character: this.character,
                conversationId: this.conversationId,
                shareable: this.shareable,
                messages: [...conversation.messages, responseMsg]
            };
        });

        if (apiResponse.isSystemMessage) {
            sendChatEvent(ChatEvents.systemChatReceived, {
                character: 'system', gptTokens: 0
            });
        }
        else {
            sendChatEvent(ChatEvents.chatReceived, {
                character: apiRequest.personality.name, gptTokens: apiResponse.responseTokens
            });
        }
    }

    public setPersonality(personality: Personality): void {
        this.personality = personality;
    }
}
