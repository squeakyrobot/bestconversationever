import type { ChatApiRequest } from "$lib/chat-api-request";
import type { ChatApiResponse } from "$lib/chat-api-response";
import type { Conversation, MessageExchange } from "$lib/conversation";
import type { User } from "$lib/user";
import { Character, Personality } from "$lib/personality";
import { ChatEvents, sendChatEvent } from "$lib/analytics";
import { PUBLIC_MAX_CLIENT_MESSAGES } from "$env/static/public";
import { assert } from "$lib/assert";
import { estimateGptTokens } from "$lib/token-estimator";
import { getEnumValue } from "$lib/util";
import { getRecaptchaToken } from "$lib/recaptcha-client";
import { nanoid } from 'nanoid'
import {
    writable,
    get,
    type Writable,
    type Unsubscriber,
    type Subscriber,
    type Invalidator
} from "svelte/store";


const MAX_CLIENT_MESSAGES = PUBLIC_MAX_CLIENT_MESSAGES ? parseInt(PUBLIC_MAX_CLIENT_MESSAGES, 10) : 15;

/**
 * Writable store for a single conversation with a character
 */
export class ConversationStore {
    public character: string;
    public conversationId: string;
    public shareable: boolean;
    public store: Writable<Conversation>;

    private personality: Personality;
    private userId: string;
    private userName: string;

    public constructor(user: User, personality?: Personality) {
        this.personality = personality || new Personality();
        this.conversationId = nanoid(10);
        this.userId = user.id;
        this.userName = user.name;
        this.shareable = false;
        this.character = this.personality.export().character;

        this.store = writable<Conversation>({
            character: this.character,
            conversationId: this.conversationId,
            shareable: this.shareable,
            userId: this.userId,
            userName: this.userName,
            messages: [],
        });
    }

    /**
     * Creates a store from an existing conversation so it can be continued
     * 
     * @param user the current user
     * @param convo Conversation to load
     * @returns a store that can be used to continue a conversation
     */
    public static fromConversation(user: User, convo: Conversation): ConversationStore {
        const convoStore = new ConversationStore(user);
        const character = getEnumValue(Character, convo.character);
        assert(character !== undefined, 'Could not load conversation. Invalid character');

        assert(user.id === convo.userId, 'Cannot load conversations from a different user');

        convoStore.personality = new Personality({ character });
        convoStore.character = convo.character;
        convoStore.conversationId = convo.conversationId;
        convoStore.shareable = convo.shareable;
        convoStore.userId = convo.userId;
        convoStore.userName = convo.userName;
        convoStore.store = writable<Conversation>(convo);

        return convoStore;
    }

    /**
     * Sends a message from the user and gets a response
     * 
     * @param text message from the user to send
     */
    public async sendUserExchange(text: string): Promise<void> {

        // Add the user message
        const userMsg: MessageExchange = {
            requestId: nanoid(10),
            name: this.userName,
            role: 'user',
            time: new Date(),
            waitingForResponse: false,
            text,
        };

        this.addMessage(userMsg);


        const previousMessages = [...get<Conversation>(this.store).messages];

        if (previousMessages.length > MAX_CLIENT_MESSAGES) {
            previousMessages.splice(0, previousMessages.length - MAX_CLIENT_MESSAGES);
        }

        const token = await getRecaptchaToken('chat');

        const apiRequest: ChatApiRequest = {
            conversationId: this.conversationId,
            id: userMsg.requestId,
            message: userMsg.text || '',
            personality: this.personality.export(),
            previousMessages,
            recaptchaToken: token,
            time: userMsg.time || new Date(),
            userId: this.userId,
            userName: this.userName,
        };


        // The initial response has no text and has the waiting flag set
        // this is so the UI can provide a loading or waiting indicator
        const responseMsg: MessageExchange = {
            name: apiRequest.personality.name,
            requestId: userMsg.requestId,
            role: 'assistant',
            waitingForResponse: true,
        };

        this.addMessage(responseMsg);


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

        this.addMessage(responseMsg, true);


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

    /**
     * Delegates the subscribe to the internal `writable`
     */
    public subscribe(
        run: Subscriber<Conversation>,
        invalidate?: Invalidator<Conversation> | undefined): Unsubscriber {

        return this.store.subscribe(run, invalidate);
    }

    /**
     * Sets the personality of the system user for the conversation
     */
    public setPersonality(personality: Personality): void {
        this.personality = personality;
    }

    /**
     * Appends a message to the conversation
     * @param message message to append
     * @param overwriteMostRecent if `true` the most recent message will be replaced by the current one
     */
    private addMessage(message: MessageExchange, overwriteMostRecent = false): void {
        this.store.update((conversation: Conversation) => {
            if (overwriteMostRecent) {
                conversation.messages.pop();
            }

            return {
                character: this.character,
                conversationId: this.conversationId,
                shareable: this.shareable,
                userId: this.userId,
                userName: this.userName,
                messages: [...conversation.messages, message,]
            };
        });
    }
}