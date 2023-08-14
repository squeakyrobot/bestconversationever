import type { PersonalityOptions } from "./personality";
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

export interface ChatApiResponse {
    requestId: string;
    conversationId: string;
    personality: PersonalityOptions;
    message: string;
    time: Date;
}