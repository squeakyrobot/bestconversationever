export interface ChatMessageItem {
    request: {
        message: string;
        time?: Date;
    };
    response: {
        waiting: boolean;
        name?: string;
        message?: string;
        time?: Date;
    };
}