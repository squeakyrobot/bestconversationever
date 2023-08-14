import type { ChatApiRequest } from "$lib/chat-api-request";

export function buildChatQuery(request: ChatApiRequest): { system: string, prompt: string } {
    const p = request.personality;

    return {
        system: `You are a ${p.mood} ${p.person} responding to a ${p.relationship} in ${p.responseLength}`,
        prompt: `"${request.message}"`,
    }
}
