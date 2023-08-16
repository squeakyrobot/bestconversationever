import { nameFormat } from "$lib/util";
import type { PageLoad } from "./$types";

export const load = (({ params }) => {
    if (params.person) {
        const name = nameFormat(params.person);

        return {
            pageTitle: `Chat with ${name}`,
            pageDescription: `Have a conversation with ${name} and see where it goes.`,
            pageOgImage: `/images/personalities/${name}.svg`,
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