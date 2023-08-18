import type { ChatApiRequest } from "$lib/chat-api-request";
import { kv } from "@vercel/kv";
import { getEnvironmentPrefix } from "./environment";

export interface SetIndex {
    key: string;
    score: number;
    member: string;
}

export interface ChatKey {
    key: string;
    indexes: SetIndex[];
}

export function generateChatKey(apiRequest: ChatApiRequest): ChatKey {
    const prefix = getEnvironmentPrefix();
    // const time = Date.now();
    const convoKey = `${prefix}:convo:${apiRequest.conversationId}`;

    return {
        key: convoKey,
        indexes: [
            // { key: `${prefix}:idx_convo_time`, score: time, member: convoKey },
            // { key: `${prefix}:idx_convo_user_time:${apiRequest.userId}`, score: time, member: convoKey },
            // { key: `${prefix}:idx_convo_char_time:${apiRequest.personality.name.toLowerCase()}`, score: time, member: convoKey },
        ]
    }
}

export async function redisKeyExists(key: string): Promise<boolean> {
    return (await kv.exists(key)) === 1;
}