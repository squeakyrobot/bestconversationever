import { Personality, Mood, ResponseLength, Relationship } from "./query-options"

export function buildQuery(
    rant: string,
    personality?: Personality,
    responseLength?: ResponseLength,
    mood?: Mood,
    relationship?: Relationship,
): { system: string, prompt: string } {
    // TODO: Check input

    personality = personality || getRandomPersonality();
    responseLength = responseLength || getRandomResponseLength();
    mood = mood || getRandomMood();
    relationship = relationship || getRandomRelationship();

    return { system: `You are a ${mood} ${personality} responding to a ${relationship} in ${responseLength}`, prompt: `${rant}` };
    // return `Respond to "${rant}" like a ${mood} ${personality} in ${responseLength}`;
}

export function getRandomPersonality(): Personality {
    const values = Object.values(Personality);

    return values[randomInt(0, values.length - 1)];
}

function getRandomMood(): Mood {
    const values = Object.values(Mood);

    return values[randomInt(0, values.length - 1)];
}

function getRandomRelationship(): Relationship {
    const values = Object.values(Relationship);

    return values[randomInt(0, values.length - 1)];
}

function getRandomResponseLength(): ResponseLength {
    const values = Object.values(ResponseLength);

    return values[randomInt(0, values.length - 1)];
}

const randomInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;