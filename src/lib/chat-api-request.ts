import type { PersonalityOptions } from '$lib/personality';
import type { ConversationItem } from "./stores/conversation";

export interface ChatApiRequest {
    id: string;
    conversationId: string;
    message: string;
    time: Date;
    personality: PersonalityOptions;
    previousMessages?: ConversationItem[];
}