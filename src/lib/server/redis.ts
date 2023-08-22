import type { Conversation } from "$lib/stores/conversation";
import { REDIS_CONNECTION_URL, REDIS_DEV_ITEM_TTL_SECONDS } from "$env/static/private";
import { createClient, type RedisClientType } from 'redis';
import { getEnvironmentPrefix } from "./environment";


export interface SetIndex {
    key: string;
    score: number;
    value: string;
}

export interface ChatKey {
    key: string;
    indexes: SetIndex[];
}

export class RedisClient {
    private internalClient: RedisClientType;

    public constructor() {
        this.internalClient = createClient({ url: REDIS_CONNECTION_URL, socket: { tls: true } });
        this.internalClient.on('error', (e) => { throw e; });
    }

    public static generateChatKey(convo: Conversation): ChatKey {
        const prefix = getEnvironmentPrefix();
        const time = Date.now();
        const convoKey = `${prefix}:convo:${convo.conversationId}`;

        return {
            key: convoKey,
            indexes: [
                // { key: `${prefix}:idx_convo_time`, score: time, member: convoKey },
                { key: `${prefix}:idx_convo_user_time:${convo.userId}`, score: time, value: convoKey },
                { key: `${prefix}:idx_convo_char_time:${convo.character.toLowerCase()}`, score: time, value: convoKey },
            ]
        }
    }

    public async keyExists(key: string): Promise<boolean> {
        try {
            if (!this.internalClient.isReady) {
                await this.internalClient.connect();
            }
            return (await this.internalClient.exists(key)) === 1;
        }
        finally {
            await this.internalClient.disconnect();
        }
    }

    public async getConversation(conversationId: string): Promise<Conversation | null> {
        try {
            const convoKey = `${getEnvironmentPrefix()}:convo:${conversationId}`;

            if (!this.internalClient.isReady) {
                await this.internalClient.connect();
            }

            const result = await this.internalClient.json.get(convoKey);


            return result as unknown as Conversation | null;

        }
        catch (e) {
            // TODO: log
            return null;
        }
        finally {
            if (this.internalClient.isReady) {
                await this.internalClient.disconnect();
            }
        }
    }

    public async saveConversation(convo: Conversation): Promise<boolean> {
        try {
            const chatKey = RedisClient.generateChatKey(convo);


            if (!this.internalClient.isReady) {
                await this.internalClient.connect();
            }


            const keyExists = (await this.internalClient.exists(chatKey.key)) === 1;
            const redisPromises: Promise<unknown>[] = [];


            if (keyExists) {
                // append to messages using JSONpath

                redisPromises.push(
                    this.internalClient.json.arrAppend(
                        chatKey.key, '$.messages', ...convo.messages));

            }
            else {
                // create new item and indexes
                redisPromises.push(
                    this.internalClient.json.set(
                        chatKey.key, '$', convo));

                for (const item of chatKey.indexes) {
                    redisPromises.push(
                        this.internalClient.zAdd(item.key, { score: item.score, value: item.value }));
                }

                // expire dev items
                if (getEnvironmentPrefix() !== 'prod') {
                    const ttl = parseInt(REDIS_DEV_ITEM_TTL_SECONDS || "86400", 10);

                    redisPromises.push(this.internalClient.expire(chatKey.key, ttl));

                    for (const item of chatKey.indexes) {
                        redisPromises.push(
                            this.internalClient.expire(item.key, ttl));
                    }
                }
            }

            await Promise.all(redisPromises);

            return true;
        }
        catch (e) {
            return false;
        }
        finally {
            if (this.internalClient.isReady) {
                await this.internalClient.disconnect();
            }
        }
    }
}
