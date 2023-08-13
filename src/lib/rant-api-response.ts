import type { Personality, Mood, Relationship } from "./query-options";

export interface RantApiResponse {
    personName: string;
    response: string;
    responseTime: Date;
    personality?: Personality;
    mood?: Mood;
    relationship?: Relationship;
    prompt?: string;
    rant?: string;
    rantTime?: Date;
}