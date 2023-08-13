import type { Mood, Personality, Relationship, ResponseLength } from "./query-options";
import type { PersonalityOptions } from '$lib/personality';

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
    message: string;
    time: Date;
    personality: PersonalityOptions;
    previousMessages?: {
        role: 'user' | 'assistant',
        content: string;
    }[];
}