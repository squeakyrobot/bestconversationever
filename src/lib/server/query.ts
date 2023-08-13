import type { ChatApiRequest } from "$lib/rant-api-request";
import type { RantApiRequest } from "$lib/rant-api-request";
import {
    Personality,
    Mood,
    Relationship,
    getRandomMood,
    getRandomPersonality,
    getRandomRelationship,
    getRandomResponseLength
} from "../query-options"



export function buildQuery(
    rantRequest: RantApiRequest
): { system: string, prompt: string, personality: Personality, mood: Mood, relationship: Relationship } {
    // TODO: Check input

    const personality = rantRequest.personality || getRandomPersonality();
    const mood = rantRequest.mood || getRandomMood();
    const relationship = rantRequest.relationship || getRandomRelationship();
    const responseLength = rantRequest.responseLength || getRandomResponseLength();

    return {
        system: `You are a ${mood} ${personality} responding to a ${relationship} in ${responseLength}`,
        prompt: `${rantRequest.rant}`,
        personality,
        mood,
        relationship,
    };
}

export function buildChatQuery(request: ChatApiRequest): { system: string, prompt: string } {
    const p = request.personality;

    return {
        system: `You are a ${p.mood} ${p.person} responding to a ${p.relationship} in ${p.responseLength}`,
        prompt: `"${request.message}"`,
    }
}