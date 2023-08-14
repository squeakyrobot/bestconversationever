import type { PersonalityOptions } from "./personality";

export interface ChatApiResponse {
    requestId: string;
    conversationId: string;
    personality: PersonalityOptions;
    message: string;
    time: Date;
}