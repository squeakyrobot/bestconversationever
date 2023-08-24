
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