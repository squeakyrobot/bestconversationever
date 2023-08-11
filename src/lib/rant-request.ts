import type { Mood, Personality, Relationship, ResponseLength } from "./query-options";

export interface RantRequest {
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