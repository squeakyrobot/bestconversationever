import type { PageLoad } from "./$types";
import { Character } from "$lib/personality";
import { nameFormat } from "$lib/util";

export const load = (({ params }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (params.character && (Character as any)[nameFormat(params.character)]) {
        const name = nameFormat(params.character);

        return {
            pageTitle: `Chat with ${name}`,
            pageDescription: `Start a conversation with ${name} and see where it goes...`,
            pageOgImage: `/images/characters/${name}-og.png`,
        };
    }
    else {
        return {
            pageTitle: 'Chat',
            pageDescription: 'Start a conversation and we\'ll find someone who will listen to what you have to say.',
            pageOgImage: undefined,
        };
    }

}) satisfies PageLoad;

export function entries() {
    return Object.keys(Character).map((v) => {
        return { person: v.toLowerCase() };
    });
}