import type { RantApiRequest } from "$lib/rant-request";
import {
    Personality,
    Mood,
    ResponseLength,
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
    // return `Respond to "${rant}" like a ${mood} ${personality} in ${responseLength}`;
}
