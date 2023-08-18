import type { ChatApiRequest } from "$lib/chat-api-request";
import { Character } from "$lib/personality";
import { getEnumKey } from "$lib/util";

interface QueryModifier {
    search: string;
    systemModifier: string;
}

const queryModifiers: QueryModifier[] = Object.values(Character).map((character) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const characterName = getEnumKey(Character, character)!.toLowerCase();
    const systemModifier = `you know ${characterName} who is a ${character.split(';')[0]};`;

    return { search: characterName, systemModifier };
});

queryModifiers.push(
    { search: 'bela', systemModifier: ';you know Bela who is a super smart you lady, who is from La Mesa, CA that you respect a lot;' },
    { search: 'marissa', systemModifier: ';you know Marissa who is a super smart you lady, who is from La Mesa, CA that you respect a lot, she is mother to Aidan, Damon, and stepmother to Bela, Bo and Seamus;' },
    { search: 'bo', systemModifier: ';you know Bo who is a super smart you kid, who is from La Mesa, CA, he plays saxaphone and likes video games;' },
    // { search: 'aidan', systemModifier: ';you know Bela who is a super smart you lady, who is from La Mesa, CA that you respect a lot;' },
    // { search: 'damon', systemModifier: ';you know Bela who is a super smart you lady, who is from La Mesa, CA that you respect a lot;' },
    // { search: 'seamus', systemModifier: ';you know Bela who is a super smart you lady, who is from La Mesa, CA that you respect a lot;' },
    // { search: 'ryan', systemModifier: ';you know Bela who is a super smart you lady, who is from La Mesa, CA that you respect a lot;' },
);


/**
 * Creates the ChatGPT promts from the api request
 * 
 * @param request 
 * @returns 
 */
export function buildChatQuery(request: ChatApiRequest): { system: string, prompt: string } {
    const p = request.personality;
    const searchText = request.message.toLowerCase();
    let modifier = '';

    for (const item of queryModifiers) {
        if (searchText.includes(item.search)) {
            modifier += item.systemModifier;
        }
    }

    return {
        system: `You are a ${p.mood} ${p.character}${modifier} responding to a ${p.relationship} in ${p.responseLength} `,
        prompt: `"${request.message}"`,
    }
}
