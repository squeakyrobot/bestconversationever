import type { PersonalityOptions } from '$lib/personality';
import type { MessageExchange } from "./conversation";

export interface ChatApiRequest {
    id: string;
    conversationId: string;
    message: string;
    time: Date;
    userId: string;
    userName: string;
    personality: PersonalityOptions;
    previousMessages?: MessageExchange[];
    recaptchaToken?: string;
}