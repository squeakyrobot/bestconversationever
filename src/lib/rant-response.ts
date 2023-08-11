
export interface RantResponse {
    personName: string;
    response: string;
    responseTime: Date;
    prompt?: string;
    rant?: string;
    rantTime?: Date;
}