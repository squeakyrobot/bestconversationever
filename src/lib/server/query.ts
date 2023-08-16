import type { ChatApiRequest } from "$lib/chat-api-request";

/**
 * Creates the ChatGPT promts from the api request
 * 
 * @param request 
 * @returns 
 */
export function buildChatQuery(request: ChatApiRequest): { system: string, prompt: string } {
    const p = request.personality;

    return {
        system: `You are a ${p.mood} ${p.person} responding to a ${p.relationship} in ${p.responseLength}`,
        prompt: `"${request.message}"`,
    }
}
