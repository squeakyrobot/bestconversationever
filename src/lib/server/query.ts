import type { ChatApiRequest } from "$lib/chat-api-request";
import { estimateGptTokens } from "$lib/token-estimator";
import { SettingsQueryModifier, type UserSettings } from "$lib/user";
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
    if (!settings) {
        return '';
    }

    let modifier = '';

    if (characterName && characterName.toLowerCase() === 'elvis') {
        switch (settings.goatFreq) {
            case SettingsQueryModifier.Extra:
                modifier += ';you also resond with bleats and baa like a goat;';
                break;
            case SettingsQueryModifier.Absurd:
                modifier += ';you mostly respond with bleats and baa like a goat;'
                break;
        }

        switch (settings.robotFreq) {
            case SettingsQueryModifier.Extra:
                modifier += ';you also resond with beeps and boops like a robot;';
                break;
            case SettingsQueryModifier.Absurd:
                modifier += ';you mostly resond with beeps and boops like a robot;'
                break;
        }

        return modifier;
    }

    switch (settings.goatFreq) {
        case SettingsQueryModifier.Extra:
            modifier += ';You like goats and talk about them sometimes;';
            break;
        case SettingsQueryModifier.Absurd:
            modifier += ';You love goats. You try to work goats into conversation as much as possible;'
            break;
    }

    switch (settings.robotFreq) {
        case SettingsQueryModifier.Extra:
            modifier += ';You like robots and talk about them sometimes;';
            break;
        case SettingsQueryModifier.Absurd:
            modifier += ';You love robots. You try to work robots into conversation as much as possible;'
            break;
    }

    switch (settings.skateboardFreq) {
        case SettingsQueryModifier.Extra:
            modifier += ';You like skateboards and talk about them sometimes;';
            break;
        case SettingsQueryModifier.Absurd:
            modifier += ';You love skateboards. You try to work skateboards into conversation as much as possible;'
            break;
    }

    switch (settings.unicycleFreq) {
        case SettingsQueryModifier.Extra:
            modifier += ';You like unicycles and talk about them often;';
            break;
        case SettingsQueryModifier.Absurd:
            modifier += ';You love unicycles. You try to work unicycles into conversation as much as possible;'
            break;
    }


    // if (settings && settings.goatFreq === SettingsQueryModifier.Absurd) {
    //     if (characterName && characterName.toLowerCase() === 'elvis') {
    //         return ';you also resond with bleat and baa like a goat, more than you bark;';
    //     }

    //     let goatModifier = ';You love goats. Goats are your favorite thing. You try to work goats into conversation as much as possible.';

    //     if (characterName && ['s', 'w', 'f', 'n'].includes(characterName.toLowerCase().charAt(0))) {
    //         goatModifier += ' Your favorite goat is named Pepe.';
    //     }

    //     return goatModifier
    // }

    return modifier;
}
