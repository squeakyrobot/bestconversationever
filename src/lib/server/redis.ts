import type { ChatApiRequest } from "$lib/chat-api-request";
import { kv } from "@vercel/kv";
import { getEnvironmentPrefix } from "./environment";
import type { Conversation } from "$lib/stores/conversation";

export interface SetIndex {
    key: string;
    score: number;
    member: string;
}

export interface ChatKey {
    key: string;
    indexes: SetIndex[];
}

export function generateChatKey(convo: Conversation): ChatKey {
    const prefix = getEnvironmentPrefix();
    const time = Date.now();
    const convoKey = `${prefix}:convo:${convo.conversationId}`;

    return {
        key: convoKey,
        indexes: [
            // { key: `${prefix}:idx_convo_time`, score: time, member: convoKey },
            { key: `${prefix}:idx_convo_user_time:${convo.userId}`, score: time, member: convoKey },
            { key: `${prefix}:idx_convo_char_time:${convo.character.toLowerCase()}`, score: time, member: convoKey },
        ]
    }
}

export async function redisKeyExists(key: string): Promise<boolean> {
    return (await kv.exists(key)) === 1;
}

export async function saveConversation(convo: Conversation): Promise<boolean> {
    try {
        const chatKey = generateChatKey(convo);
        const keyExists = await redisKeyExists(chatKey.key);
        const kvPromises: Promise<unknown>[] = [];

        if (keyExists) {
            // append to messages using JSONpath
            kvPromises.push(kv.json.arrappend(chatKey.key, '$.messages', ...convo.messages));

        }
        else {
            // create new item and indexes
            kvPromises.push(kv.json.set(chatKey.key, '$', convo as unknown as Record<string, unknown>));

            for (const item of chatKey.indexes) {
                kvPromises.push(kv.zadd(item.key, { score: item.score, member: item.member }));
            }
        }

        await Promise.all(kvPromises);

        return true;
    }
    catch (e) {
        console.log(e);
        return false;
    }
}