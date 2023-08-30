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

let internalClient: RedisClientType;

export class RedisClient {

    public constructor(private session: Session) {
        if (!internalClient) {
            internalClient = createClient({ url: REDIS_CONNECTION_URL, socket: { tls: true } });
            internalClient.on('error', (e) => { throw e; });
        }
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

    @connectionRequired
    public async keyExists(key: string): Promise<boolean> {
        return (await internalClient.exists(key)) === 1;
    }

    @connectionRequired
    public async getConversation(conversationId: string): Promise<Conversation | null> {
        try {
            const convoKey = `${getEnvironmentPrefix()}:convo:${conversationId}`;

            const result = await internalClient.json.get(convoKey) as unknown as Conversation | null;

            // TODO: use a typeguard
            return result;

        }
        catch (e) {
            // TODO: log
            return null;
        }
    }

    @connectionRequired
    public async saveUserAccount(account: UserAccount): Promise<string> {

        assert(account.authSources.length > 0,
            'Cannot save account. Improper indexing data');

        const accountKey = RedisClient.generateUserAccountKeys(account);

        const redisTran = internalClient.multi();

        redisTran.json.set(accountKey.key, '$', account);

        for (const index of accountKey.indexes) {
            redisTran.set(index.key, index.value);
        }

        await redisTran.exec();

        await this.expireDevItems([accountKey.key, ...accountKey.indexes.map((i) => i.key)]);

        return accountKey.key;
    }

    @connectionRequired
    public async updateUserSettings(accountId: string, settings: UserSettings): Promise<boolean> {

        try {
            const key = `${getEnvironmentPrefix()}:account:${accountId}`;
            await internalClient.json.set(key, '$.user.settings', settings);

            return true;
        }
        catch (e) {
            console.error(e);
            return false;
        }
    }

    @connectionRequired
    public async findUserAccount(authInfo: AuthenticatorInfo): Promise<UserAccount | null> {

        const idxKey = `${getEnvironmentPrefix()}:idx_account:${authInfo.authenticator}-${authInfo.id}`;

        const accountKey = await internalClient.get(idxKey);

        if (accountKey) {
            const user = await internalClient.json.get(accountKey);

            // TODO: use a typeguard
            return user as unknown as UserAccount | null;
        }

        return null;
    }

    @connectionRequired
    public async getConversationKey(userId: string, characterName: string): Promise<string | undefined> {
        const key = `${getEnvironmentPrefix()}:idx_convo_user:${userId}`;

        const results = await internalClient.zRangeWithScores(key, 0, -1, { REV: true });
        characterName = characterName.toLowerCase();

        for (const item of results) {
            const convoListItem = unpackConversationListItem(item.value);

            if (convoListItem.characterName.toLowerCase() === characterName) {
                return convoListItem.convoKey;
            }
        }

        return undefined;

    }

    @connectionRequired
    public async getConversationList(userId: string): Promise<ConversationList> {
        try {
            const key = `${getEnvironmentPrefix()}:idx_convo_user:${userId}`;

            const result = await internalClient.zRangeWithScores(key, 0, -1, { REV: true });

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
                const snippits = (await internalClient.json.mGet(
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
    }

    // TODO: differeintiate from adding a convo and appendign messages better
    @connectionRequired
    public async saveConversation(convo: Conversation, forceFullUpdate = false): Promise<boolean> {
        try {
            const chatKey = RedisClient.generateConvoKeys(convo);
            const keyExists = (await internalClient.exists(chatKey.key)) === 1;
            const redisPromises: Promise<unknown>[] = [];


            // Append the new messages if the conversation exists
            if (keyExists && !forceFullUpdate) {
                redisPromises.push(
                    internalClient.json.arrAppend(
                        chatKey.key, '$.messages', ...convo.messages));
            }
            else {
                redisPromises.push(
                    internalClient.json.set(
                        chatKey.key, '$', convo));
            }

            // Updated the indexes so the score/time gets updated
            for (const item of chatKey.indexes) {
                redisPromises.push(
                    internalClient.zAdd(item.key, { score: item.score, value: item.value }));
            }

            await Promise.all(redisPromises);

            await this.expireDevItems([chatKey.key, ...chatKey.indexes.map((i) => i.key)]);

            return true;
        }
        catch (e) {
            return false;
        }
    }

    @connectionRequired
    private async expireDevItems(keys: string[]): Promise<void> {
        if (getEnvironmentPrefix() !== 'prod') {
            const redisPromises: Promise<unknown>[] = [];

            const ttl = parseInt(REDIS_DEV_ITEM_TTL_SECONDS || '86400', 10);

            for (const key of keys) {
                redisPromises.push(
                    internalClient.expire(key, ttl));
            }

            await Promise.all(redisPromises);
        }
    }
}


function connectionRequired(target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalValue = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
        if (!internalClient.isReady) {
            await internalClient.connect();
        }

        return originalValue.apply(this, args);
    }
}