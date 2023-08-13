import { derived, writable, Writable } from "svelte/store";

export interface ConversationItem {
    request: {
        message: string;
        time?: Date;
    };
    response: {
        waiting: boolean;
        name?: string;
        message?: string;
        time?: Date;
    };
}

export interface Conversation {
    messages: ConversationItem[];
}

class ConversationStore {

}

export const converstation = new ConversationStore();