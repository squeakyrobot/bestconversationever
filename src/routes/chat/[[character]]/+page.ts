import type { PageLoad } from "./$types";
import { Character, characterExists } from "$lib/personality";
import { nameFormat } from "$lib/util";
import { assert } from "$lib/assert";
import { error } from '@sveltejs/kit';

export const load = (({ params }) => {
    if (params.character) {

        assert(characterExists(params.character),
            error(404, { message: `Character ${params.character} does not exist` }));

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