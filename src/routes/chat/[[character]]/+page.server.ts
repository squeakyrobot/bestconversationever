import type { PageServerLoad } from "./$types";
import { assert } from "$lib/assert";
import { characterExists } from "$lib/personality";
import { error } from '@sveltejs/kit';
import { nameFormat } from "$lib/util";

export const load = (({ params, locals }) => {
    if (params.character) {

        assert(characterExists(params.character),
            error(404, { message: `Character ${params.character} does not exist` }));

        const characterName = nameFormat(params.character);

        return {
            user: locals.session.user,
            characterName,
            pageTitle: `Chat with ${characterName}`,
            pageDescription: `Start a conversation with ${characterName} and see where it goes...`,
            pageOgImage: `/images/characters/${characterName}-og.png`,
        };
    }
    else {
        return {
            user: locals.session.user,
            pageTitle: 'Chat',
            pageDescription: 'Start a conversation and we\'ll find someone who will listen to what you have to say.',
            pageOgImage: undefined,
        };
    }

}) satisfies PageServerLoad;

