import type { PersonalityOptions } from "./personality";

export interface ChatApiResponse {
    requestId: string;
    conversationId: string;
    personality: PersonalityOptions;
    message: string;
    time: Date;
    responseTokens?: number;
    totalTokens?: number;
    recaptchaScore?: number;
}