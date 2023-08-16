
export enum ChatEvents {
    chatStart = 'chat_start',
    chatClosed = 'chat_closed',
    chatSent = 'chat_sent',
    systemChatReceived = 'system_chat_received',
    chatReceived = 'chat_received',
    personChanged = 'person_changed',
}

export interface ChatEventParams {
    character: string,
    gptTokens?: number,
}

export async function sendEvent(
    eventName: string,
    eventData: ChatEventParams | { [key: string]: string }): Promise<void> {

    gtag('event', eventName, eventData);
}

export async function sendChatEvent(event: ChatEvents, params: ChatEventParams): Promise<void> {
    sendEvent(event, params);
}