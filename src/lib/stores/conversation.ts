import { Personality } from "$lib/personality";
import type { ChatApiRequest } from "$lib/rant-api-request";
import type { ChatApiResponse } from "$lib/rant-api-response";
import { writable, get, type Writable, type Unsubscriber } from "svelte/store";

export interface ConversationItem {
    role: 'user' | 'assistant';
    name: string;
    time?: Date;
    text?: string;
    waitingForResponse: boolean;
}

export interface Conversation {
    messages: ConversationItem[];
    // waitingForResponse: boolean;
}

export class ConversationStore {
    public store: Writable<Conversation>;
    private conversationId: string;
    private personality: Personality;
    public subscribe: Unsubscriber;

    constructor(personality?: Personality) {
        this.personality = personality || new Personality();
        this.conversationId = 'TODO: add Conversation ID';
        this.store = writable<Conversation>({ messages: [] });
        this.subscribe = this.store.subscribe;
    }

    public async set(text: string): Promise<void> {

        // Add the user message
        const userMsg: ConversationItem = {
            name: 'Anonymous',
            role: 'user',
            time: new Date(),
            waitingForResponse: false,
            text,
        };

        const previousMessages = get<Conversation>(this.store).messages;


        const apiRequest: ChatApiRequest = {
            id: 'TODO: Add ID',
            conversationId: this.conversationId,
            personality: this.personality.getPersonality(),
            message: userMsg.text || '',
            time: userMsg.time || new Date(),
            previousMessages,
        };


        const responseMsg: ConversationItem = {
            name: apiRequest.personality.name,
            role: 'assistant',
            waitingForResponse: true,
        };

        this.store.update((conversation: Conversation) => {
            return {
                messages: [
                    ...conversation.messages,
                    userMsg,
                    responseMsg]
            };
        });


        const apiCall = await fetch('/api/chat', {
            method: 'POST',
            body: JSON.stringify(apiRequest),
        });

        const apiResponse = await apiCall.json() as ChatApiResponse;

        // const responseMsg: ConversationItem = {
        //     name: apiRequest.personality.name,
        //     role: 'assistant',
        //     time: new Date(),
        //     waitingForResponse: false,
        //     text: apiResponse.message,
        // };

        responseMsg.time = new Date();
        responseMsg.text = apiResponse.message;
        responseMsg.waitingForResponse = false;

        this.store.update((conversation: Conversation) => {
            conversation.messages.pop();
            return { messages: [...conversation.messages, responseMsg] };
        });
    }

    public setPersonality(personality: Personality): void {
        this.personality = personality;
    }
}

// export const converstation = new ConversationStore();