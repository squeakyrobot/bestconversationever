import type { AuthenticatorInfo, UserAccount } from './user-account';
import type { Session } from '$lib/session';
import type { UserSettings } from '$lib/user';
import { REDIS_CONNECTION_URL, REDIS_DEV_ITEM_TTL_SECONDS } from '$env/static/private';
import { assert } from '$lib/assert';
import { createClient, type RedisClientType } from 'redis';
import { environmetPrefix } from './environment';
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

    public static generateUserIndex(userId: string, type: 'inbox' | 'archive' = 'inbox'): string {
        return `${environmetPrefix}:idx_convo_user:${type === 'archive' ? 'archive:' : ''}${userId}`;
    }

    public static generateConvoKey(convo: Conversation): string {
        return `${environmetPrefix}:convo:${convo.conversationId}`;
    }

    public static generateConvoKeys(convo: Conversation): ChatKey {
        const time = Date.now();
        const convoKey = RedisClient.generateConvoKey(convo);
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
                { key: RedisClient.generateUserIndex(convo.userId), score: time, value: idxValue },
                { key: `${environmetPrefix}:idx_convo_char:${convo.character.toLowerCase()}`, score: time, value: idxValue },
            ]
        }
    }

    public static generateUserAccountKeys(account: UserAccount): UserAccountKey {
        const key = `${environmetPrefix}:account:${account.id}`;
        const indexes: LookupIndex[] = [];

        for (const item of account.authSources) {
            indexes.push({ key: `${environmetPrefix}:idx_account:${item.authenticator}-${item.id}`, value: key });
        }

        return { key, indexes };
    }

    @connect
    public async keyExists(key: string): Promise<boolean> {
        return (await internalClient.exists(key)) === 1;
    }

    @connect
    public async getConversation(conversationId: string): Promise<Conversation | null> {
        try {
            const convoKey = `${environmetPrefix}:convo:${conversationId}`;

            const result = await internalClient.json.get(convoKey) as unknown as Conversation | null;

            // TODO: use a typeguard
            return result;

        }
        catch (e) {
            // TODO: log
            return null;
        }
    }

    @connect
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

    @connect
    public async updateUserSettings(accountId: string, settings: UserSettings): Promise<boolean> {

        try {
            const key = `${environmetPrefix}:account:${accountId}`;
            await internalClient.json.set(key, '$.user.settings', settings);

            return true;
        }
        catch (e) {
            console.error(e);
            return false;
        }
    }

    @connect
    public async findUserAccount(authInfo: AuthenticatorInfo): Promise<UserAccount | null> {

        const idxKey = `${environmetPrefix}:idx_account:${authInfo.authenticator}-${authInfo.id}`;

        const accountKey = await internalClient.get(idxKey);

        if (accountKey) {
            const user = await internalClient.json.get(accountKey);

            // TODO: use a typeguard
            return user as unknown as UserAccount | null;
        }

        return null;
    }

    @connect
    public async getConversationKey(userId: string, characterName: string): Promise<string | undefined> {
        const key = `${environmetPrefix}:idx_convo_user:${userId}`;

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

    @connect
    public async getConversationList(userId: string, archived = false): Promise<ConversationList> {
        try {
            const key = RedisClient.generateUserIndex(userId, archived ? 'archive' : 'inbox');

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

    @connect
    public async archiveConversation(conversation: Conversation): Promise<void> {

        if (!conversation || conversation.archived) {
            return;
        }

        const convoKey = RedisClient.generateConvoKey(conversation);
        const inboxKey = RedisClient.generateUserIndex(conversation.userId);
        const archiveKey = RedisClient.generateUserIndex(conversation.userId, 'archive');


        const inbox = await internalClient.zRangeWithScores(inboxKey, 0, -1, { REV: true });
        let inboxItem: SortedSetIndex | undefined = undefined;

        for (const item of inbox) {
            if (item.value.startsWith(convoKey)) {
                inboxItem = { key: inboxKey, score: item.score, value: item.value };
            }
        }

        assert(inboxItem, 'Could not find conversation in inbox to archive');

        conversation.archived = true;

        const redisTran = internalClient.multi();
        redisTran.json.set(convoKey, '$', conversation);
        redisTran.zAdd(archiveKey, { score: inboxItem.score, value: inboxItem.value });
        redisTran.zRem(inboxKey, inboxItem.value);
        await redisTran.exec();
    }

    @connect
    public async unarchiveConversation(conversation: Conversation): Promise<void> {

        if (!conversation || !conversation.archived) {
            return;
        }

        const convoKey = RedisClient.generateConvoKey(conversation);
        const inboxKey = RedisClient.generateUserIndex(conversation.userId);
        const archiveKey = RedisClient.generateUserIndex(conversation.userId, 'archive');


        const archived = await internalClient.zRangeWithScores(archiveKey, 0, -1, { REV: true });
        let archivedItem: SortedSetIndex | undefined = undefined;

        for (const item of archived) {
            if (item.value.startsWith(convoKey)) {
                archivedItem = { key: inboxKey, score: item.score, value: item.value };
            }
        }

        assert(archivedItem, 'Could not find conversation in inbox to archive');

        conversation.archived = false;

        const redisTran = internalClient.multi();
        redisTran.json.set(convoKey, '$', conversation);
        redisTran.zAdd(inboxKey, { score: archivedItem.score, value: archivedItem.value });
        redisTran.zRem(archiveKey, archivedItem.value);
        await redisTran.exec();
    }

    // TODO: differeintiate from adding a convo and appendign messages better
    @connect
    public async saveConversation(convo: Conversation, forceFullUpdate = false): Promise<boolean> {
        try {
            const convoKey = RedisClient.generateConvoKeys(convo);
            const keyExists = (await internalClient.exists(convoKey.key)) === 1;
            const redisPromises: Promise<unknown>[] = [];


            // Append the new messages if the conversation exists
            if (keyExists && !forceFullUpdate) {
                redisPromises.push(
                    internalClient.json.arrAppend(
                        convoKey.key, '$.messages', ...convo.messages));
            }
            else {
                redisPromises.push(
                    internalClient.json.set(
                        convoKey.key, '$', convo));
            }

            // Updated the indexes so the score/time gets updated
            for (const item of convoKey.indexes) {
                redisPromises.push(
                    internalClient.zAdd(item.key, { score: item.score, value: item.value }));
            }

            await Promise.all(redisPromises);

            await this.expireDevItems([convoKey.key, ...convoKey.indexes.map((i) => i.key)]);

            return true;
        }
        catch (e) {
            return false;
        }
    }

    @connect
    private async expireDevItems(keys: string[]): Promise<void> {
        if (environmetPrefix !== 'prod') {
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


function connect(target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalValue = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
        if (!internalClient.isReady) {
            await internalClient.connect();
        }

        return originalValue.apply(this, args);
    }
}