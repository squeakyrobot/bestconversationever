import type { ChatApiRequest } from "$lib/chat-api-request";
import { estimateGptTokens } from "$lib/token-estimator";
import { queryModifiers } from "./query-modifiers";

export interface QueryResult {
    system: string;
    prompt: string;
    systemTokens: number;
    promptTokens: number;
}

/**
 * Creates the ChatGPT promts from the api request
 * 
 * @param request 
 * @returns 
 */
export function buildChatQuery(request: ChatApiRequest): QueryResult {
    const p = request.personality;
    const searchText = request.message.toLowerCase();
    let modifier = '';

    for (const item of queryModifiers) {
        if (searchText.includes(item.search)) {
            modifier += item.systemModifier;
        }
    }

    const system = `You are a ${p.mood} ${p.character} ${modifier} responding to a ${p.relationship} in ${p.responseLength}`;
    const systemTokens = estimateGptTokens(system);
    const prompt = `"${request.message}"`;
    const promptTokens = estimateGptTokens(prompt);

    return {
        system,
        prompt,
        systemTokens,
        promptTokens,
    }
}
