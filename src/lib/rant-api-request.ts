import type { Mood, Personality, Relationship, ResponseLength } from "./query-options";

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