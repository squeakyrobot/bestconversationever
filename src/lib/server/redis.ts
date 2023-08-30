import type { AuthenticatorInfo, UserAccount } from './user-account';
import type { Session } from '$lib/session';
import type { UserSettings } from '$lib/user';
import { REDIS_CONNECTION_URL, REDIS_DEV_ITEM_TTL_SECONDS } from '$env/static/private';
import { assert } from '$lib/assert';
import { createClient, type RedisClientType } from 'redis';
import { getEnvironmentPrefix } from './environment';
import {
    packConversationListItem,
    truncateSnippet,
    type Conversation,
    type ConversationList,
    unpackConversationListItem,
} from '$lib/conversation';

export interface SortedSetIndex {
    key: string;
    score: number;
    value: string;
}

export interface LookupIndex {
    key: string;
    value: string;
}

export interface ChatKey {
    key: string;
    indexes: SortedSetIndex[];
}

export interface UserAccountKey {
    key: string;
    indexes: LookupIndex[];
}

export class RedisClient {
    private internalClient: RedisClientType;

    public constructor(private session: Session) {
        this.internalClient = createClient({ url: REDIS_CONNECTION_URL, socket: { tls: true } });
        this.internalClient.on('error', (e) => { throw e; });
    }

    public static generateConvoKeys(convo: Conversation): ChatKey {
        const prefix = getEnvironmentPrefix();
        const time = Date.now();
        const convoKey = `${prefix}:convo:${convo.conversationId}`;
        const idxValue = packConversationListItem({
            convoKey,
            consversationId: convo.conversationId,
            characterName: convo.character,
            userId: convo.userId,
        });

        return {
            key: convoKey,
            indexes: [
                // { key: `${prefix}:idx_convo_time`, score: time, member: convoKey },
                { key: `${prefix}:idx_convo_user:${convo.userId}`, score: time, value: idxValue },
                { key: `${prefix}:idx_convo_char:${convo.character.toLowerCase()}`, score: time, value: idxValue },
            ]
        }
    }

    public static generateUserAccountKeys(account: UserAccount): UserAccountKey {
        const prefix = getEnvironmentPrefix();

        const key = `${prefix}:account:${account.id}`;
        const indexes: LookupIndex[] = [];

        for (const item of account.authSources) {
            indexes.push({ key: `${prefix}:idx_account:${item.authenticator}-${item.id}`, value: key });
        }

        return { key, indexes };
    }


    public async keyExists(key: string): Promise<boolean> {
        try {
            if (!this.internalClient.isReady) {
                await this.internalClient.connect();
            }
            return (await this.internalClient.exists(key)) === 1;
        }
        finally {
            // await this.internalClient.disconnect();
        }
    }

    public async getConversation(conversationId: string): Promise<Conversation | null> {
        try {
            const convoKey = `${getEnvironmentPrefix()}:convo:${conversationId}`;

            if (!this.internalClient.isReady) {
                await this.internalClient.connect();
            }

            const result = await this.internalClient.json.get(convoKey) as unknown as Conversation | null;

            // TODO: use a typeguard
            return result;

        }
        catch (e) {
            // TODO: log
            return null;
        }
        finally {
            // if (this.internalClient.isReady) {
            //     await this.internalClient.disconnect();
            // }
        }
    }

    public async saveUserAccount(account: UserAccount): Promise<string> {

        assert(account.authSources.length > 0,
            'Cannot save account. Improper indexing data');

        const accountKey = RedisClient.generateUserAccountKeys(account);

        try {
            if (!this.internalClient.isReady) {
                await this.internalClient.connect();
            }

            const redisTran = this.internalClient.multi();

            redisTran.json.set(accountKey.key, '$', account);

            for (const index of accountKey.indexes) {
                redisTran.set(index.key, index.value);
            }

            await redisTran.exec();

            await this.expireDevItems([accountKey.key, ...accountKey.indexes.map((i) => i.key)]);

            return accountKey.key;

        }
        finally {
            // await this.internalClient.disconnect();
        }
    }

    public async updateUserSettings(accountId: string, settings: UserSettings): Promise<boolean> {

        try {
            if (!this.internalClient.isReady) {
                await this.internalClient.connect();
            }

            const key = `${getEnvironmentPrefix()}:account:${accountId}`;
            await this.internalClient.json.set(key, '$.user.settings', settings);

            return true;
        }
        catch (e) {
            console.error(e);
            return false;
        }
        finally {
            // await this.internalClient.disconnect();
        }
    }

    public async findUserAccount(authInfo: AuthenticatorInfo): Promise<UserAccount | null> {
        try {
            if (!this.internalClient.isReady) {
                await this.internalClient.connect();
            }

            const idxKey = `${getEnvironmentPrefix()}:idx_account:${authInfo.authenticator}-${authInfo.id}`;

            const accountKey = await this.internalClient.get(idxKey);

            if (accountKey) {
                const user = await this.internalClient.json.get(accountKey);

                // TODO: use a typeguard
                return user as unknown as UserAccount | null;
            }

            return null;

        }
        finally {
            // await this.internalClient.disconnect();
        }
    }

    public async getConversationKey(userId: string, characterName: string): Promise<string | undefined> {
        const key = `${getEnvironmentPrefix()}:idx_convo_user:${userId}`;

        try {
            if (!this.internalClient.isReady) {
                await this.internalClient.connect();
            }

            const results = await this.internalClient.zRangeWithScores(key, 0, -1, { REV: true });
            characterName = characterName.toLowerCase();

            for (const item of results) {
                const convoListItem = unpackConversationListItem(item.value);

                if (convoListItem.characterName.toLowerCase() === characterName) {
                    return convoListItem.convoKey;
                }
            }

            return undefined;
        }
        finally {
            // await this.internalClient.disconnect();
        }
    }

    public async getConversationList(userId: string): Promise<ConversationList> {
        try {
            const key = `${getEnvironmentPrefix()}:idx_convo_user:${userId}`;

            if (!this.internalClient.isReady) {
                await this.internalClient.connect();
            }

            const result = await this.internalClient.zRangeWithScores(key, 0, -1, { REV: true });

            if (!result) {
                return [];
            }


            const convoList = result.map(item => {
                const time = new Date(item.score);
                const convoListItem = unpackConversationListItem(item.value);

                return {
                    time,
                    ...convoListItem,
                }
            });


            // Get and add the conversation snipets to display in the inbox
            if (convoList.length > 0) {
                const snippits = (await this.internalClient.json.mGet(
                    convoList.map(v => v.convoKey), '$.messages[-1].text'
                )) as Array<string[]>;


                for (let i = 0; i < convoList.length; i++) {
                    if (snippits[i] && snippits[i][0]) {
                        convoList[i].snippet = truncateSnippet(snippits[i][0] as string);
                    }
                }
            }


            return convoList;
        }
        catch (e) {
            // TODO: log
            console.error(e);
            return [];
        }
        finally {
            // if (this.internalClient.isReady) {
            //     await this.internalClient.disconnect();
            // }
        }
    }

    // TODO: differeintiate from adding a convo and appendign messages better
    public async saveConversation(convo: Conversation, forceFullUpdate = false): Promise<boolean> {
        try {
            const chatKey = RedisClient.generateConvoKeys(convo);


            if (!this.internalClient.isReady) {
                await this.internalClient.connect();
            }


            const keyExists = (await this.internalClient.exists(chatKey.key)) === 1;
            const redisPromises: Promise<unknown>[] = [];


            // Append the new messages if the conversation exists
            if (keyExists && !forceFullUpdate) {
                redisPromises.push(
                    this.internalClient.json.arrAppend(
                        chatKey.key, '$.messages', ...convo.messages));
            }
            else {
                redisPromises.push(
                    this.internalClient.json.set(
                        chatKey.key, '$', convo));
            }

            // Updated the indexes so the score/time gets updated
            for (const item of chatKey.indexes) {
                redisPromises.push(
                    this.internalClient.zAdd(item.key, { score: item.score, value: item.value }));
            }

            await Promise.all(redisPromises);

            await this.expireDevItems([chatKey.key, ...chatKey.indexes.map((i) => i.key)]);

            return true;
        }
        catch (e) {
            return false;
        }
        finally {
            // if (this.internalClient.isReady) {
            //     await this.internalClient.disconnect();
            // }
        }
    }

    private async expireDevItems(keys: string[]): Promise<void> {
        if (getEnvironmentPrefix() !== 'prod') {
            const redisPromises: Promise<unknown>[] = [];

            const ttl = parseInt(REDIS_DEV_ITEM_TTL_SECONDS || '86400', 10);

            for (const key of keys) {
                redisPromises.push(
                    this.internalClient.expire(key, ttl));
            }

            await Promise.all(redisPromises);
        }
    }
}