import type { ChatApiRequest } from "$lib/chat-api-request";
import type { ChatApiResponse } from "$lib/chat-api-response";
import type { Conversation, MessageExchange, ParticipantList } from "$lib/conversation";
import type { User } from "$lib/user";
import { Character, Personality } from "$lib/personality";
import { ChatEvents, sendChatEvent } from "$lib/analytics";
import { PUBLIC_MAX_CLIENT_MESSAGES } from "$env/static/public";
import { assert } from "$lib/assert";
import { estimateGptTokens } from "$lib/token-estimator";
import { getEnumValue, newId } from "$lib/util";
import { getRecaptchaToken } from "$lib/recaptcha-client";
import {
    writable,
    get,
    type Writable,
    type Unsubscriber,
    type Subscriber,
    type Invalidator
} from "svelte/store";
import { tick } from "svelte";


const MAX_CLIENT_MESSAGES = PUBLIC_MAX_CLIENT_MESSAGES ? parseInt(PUBLIC_MAX_CLIENT_MESSAGES, 10) : 15;

/**
 * Writable store for a single conversation with a character
 */
export class ConversationStore {
    public character: string;
    public conversationId: string;
    public shareable: boolean;
    public store: Writable<Conversation>;
    public personality: Personality;
    private userId: string;
    private userName: string;
    private participants: ParticipantList;

    public constructor(user: User, personality?: Personality) {
        this.personality = personality || new Personality();
        this.conversationId = newId();
        this.userId = user.id;
        this.userName = user.settings.displayName;
        this.shareable = false;
        this.character = this.personality.export().character;

        const characterName = this.personality.getName(this.personality.character);

        this.participants = {};

        this.participants[`${this.userName}`] = {
            displayName: this.userName,
            avatarUrl: user.settings.avatarUrl,
        };

        this.participants[`${characterName}`] = {
            displayName: characterName,
            avatarUrl: `/images/characters/${characterName}.svg`,
        };

        this.store = writable<Conversation>({
            archived: false,
            character: this.character,
            conversationId: this.conversationId,
            shareable: this.shareable,
            userId: this.userId,
            userName: this.userName,
            participants: this.participants,
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
        const character = getEnumValue(Character, convo.character);
        assert(character !== undefined, 'Could not load conversation. Invalid character');
        assert(user.id === convo.userId, 'Cannot load conversations from a different user');

        const convoStore = new ConversationStore(user, new Personality({ character }));

        convoStore.conversationId = convo.conversationId;
        convoStore.shareable = convo.shareable;
        convoStore.userId = user.id;
        convoStore.userName = user.settings.displayName;

        if (!convo.participants[`${convoStore.userName}`]) {
            convo.participants[`${convoStore.userName}`] = {
                displayName: convoStore.userName,
                avatarUrl: user.settings.avatarUrl,
            };
        }

        // TODO: If the participants change they will not be updated in the DB
        // This is because we append messages only. THis happens whenever the user 
        // changes their display name. The solution could be to update the participants
        // of existing conversations when the display name changes

        convoStore.participants = convo.participants;

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
            requestId: newId(),
            name: this.userName,
            role: 'user',
            time: new Date(),
            waitingForResponse: false,
            text,
        };

        this.addMessage(userMsg);

        await tick();

        const previousMessages = [...get<Conversation>(this.store).messages];

        if (previousMessages.length > MAX_CLIENT_MESSAGES) {
            previousMessages.splice(0, previousMessages.length - MAX_CLIENT_MESSAGES);
        }

        const token = await getRecaptchaToken('chat');

        // The initial response has no text and has the waiting flag set
        // this is so the UI can provide a loading or waiting indicator
        const personalityOptions = this.personality.export();

        const responseMsg: MessageExchange = {
            name: personalityOptions.name,
            requestId: userMsg.requestId,
            role: 'assistant',
            waitingForResponse: true,
        };

        this.addMessage(responseMsg);
        await tick();

        const apiRequest: ChatApiRequest = {
            conversationId: this.conversationId,
            id: userMsg.requestId,
            message: userMsg.text || '',
            personality: personalityOptions,
            previousMessages,
            recaptchaToken: token,
            time: userMsg.time || new Date(),
            userId: this.userId,
            userName: this.userName,
        };



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

            conversation.shareable = this.shareable;
            conversation.messages.push(message);

            return conversation;
        });
    }
}
