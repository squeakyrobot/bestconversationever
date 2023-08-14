import type { Mood, Personality, Relationship, ResponseLength } from "./query-options";
import type { PersonalityOptions } from '$lib/personality';
import type { ConversationItem } from "./stores/conversation";

export interface RantApiRequest {
    rant: string;
    personality?: Personality;
    mood?: Mood;
    relationship?: Relationship;
    responseLength?: ResponseLength;
    previousMessages?: {
        role: 'user' | 'assistant',
        content: string;
    }[];
}

export interface ChatApiRequest {
    id: string;
    conversationId: string;
    message: string;
    time: Date;
    personality: PersonalityOptions;
    previousMessages?: ConversationItem[];
}