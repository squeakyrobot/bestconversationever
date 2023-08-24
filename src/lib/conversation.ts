import { assert } from "./assert";

export type MessageExchange = {
    name: string;
    requestId: string;
    role: 'user' | 'assistant';
    text?: string;
    time?: Date;
    waitingForResponse: boolean;
}

export type Conversation = {
    character: string;
    conversationId: string;
    shareable: boolean;
    userId: string;
    userName: string;
    messages: MessageExchange[];
}

export type ConversationListItem = {
    convoKey: string;
    consversationId: string;
    characterName: string;
    userId: string;
    userName: string;
}

export type ConversationList = (ConversationListItem & { time: Date })[];

export function packConversationListItem(convoListItem: ConversationListItem): string {
    return `${convoListItem.convoKey}|${convoListItem.characterName}|${convoListItem.userId}|${convoListItem.userName}`;
}

export function unpackConversationListItem(packed: string): ConversationListItem {
    const parts = packed.split('|');
    assert(parts.length === 4, 'Cannot unpack conversation list item, wrong number of elements');

    const convoKey = parts[0];

    return {
        convoKey,
        consversationId: convoKey.substring(convoKey.lastIndexOf(':')),
        characterName: parts[1],
        userId: parts[2],
        userName: parts[3],
    }
}