import { text } from "@sveltejs/kit";
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
    snippet?: string;
}

export type ConversationList = (ConversationListItem & { time: Date })[];

function truncateSnippet(text?: string): string {
    if (!text) {
        return '';
    }

    let snippet = text.replace(/\s+/g, ' ');

    if (snippet.length > 75) {
        snippet = snippet.substring(0, 72) + '...';
    }

    return snippet;
}

export function packConversationListItem(convoListItem: ConversationListItem): string {
    return `${convoListItem.convoKey}|${convoListItem.characterName}|${convoListItem.userId}|${convoListItem.userName}|${truncateSnippet(convoListItem.snippet)}`;
}

export function unpackConversationListItem(packed: string): ConversationListItem {
    const parts = packed.split('|');
    assert(parts.length === 4 || parts.length === 5, 'Cannot unpack conversation list item, wrong number of elements');

    const convoKey = parts[0];
    console.log(packed);
    return {
        convoKey,
        consversationId: convoKey.substring(convoKey.lastIndexOf(':')),
        characterName: parts[1],
        userId: parts[2],
        userName: parts[3],
        snippet: parts[4] || '',
    }
}