import type { ChatApiRequest } from "$lib/chat-api-request";
import { Character } from "$lib/personality";
import { estimateGptTokens } from "$lib/token-estimator";
import { GoatFrequency, type UserSettings } from "$lib/user";
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
export function buildChatQuery(request: ChatApiRequest, userSettings?: UserSettings): QueryResult {
    const p = request.personality;
    const searchText = request.message.toLowerCase();
    let modifier = '';

    for (const item of queryModifiers) {
        if (searchText.includes(item.search)) {
            modifier += item.systemModifier;
        }
    }

    const settingsModifier = getSettingsModifier(userSettings, p.name);

    const system = `You are a ${p.mood} ${p.character} ${modifier} responding to a ${p.relationship} in ${p.responseLength} ${settingsModifier}`;
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

function getSettingsModifier(settings?: UserSettings, characterName?: string): string {
    if (settings && settings.goatFreq === GoatFrequency.Absurd) {
        if (characterName && characterName.toLowerCase() === 'elvis') {
            return ';you also resond with bleat and baa like a goat, more than you bark;';
        }

        return ';You love goats. Goats are your favorite thing. Your favorite goat is named Pepe. You try to work goats into conversation as much as possible';
    }

    return '';
}
