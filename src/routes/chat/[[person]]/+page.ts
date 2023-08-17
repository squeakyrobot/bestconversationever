import { Person } from "$lib/personality";
import { nameFormat } from "$lib/util";
import type { PageLoad } from "./$types";

export const load = (({ params }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (params.person && (Person as any)[nameFormat(params.person)]) {
        const name = nameFormat(params.person);

        return {
            pageTitle: `Chat with ${name}`,
            pageDescription: `Start a conversation with ${name} and see where it goes...`,
            pageOgImage: `/images/personalities/${name}-og.png`,
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
    return Object.keys(Person).map((v) => {
        return { person: v.toLowerCase() };
    });
}