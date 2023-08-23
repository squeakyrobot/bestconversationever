import { Character } from "$lib/personality";
import { getEnumKey } from "$lib/util";

/**
 * When a chat is requested the system looks for the `search `term and
 * if found it will add the `systemModifier` to the system prompt.
 */
interface QueryModifier {
    search: string;
    systemModifier: string;
}


// THis makes so the cahracters are aware of each other if they are mentioned by name
const characterModifiers: QueryModifier[] = Object.values(Character).map((character) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const characterName = getEnumKey(Character, character)!.toLowerCase();
    const systemModifier = `you know ${characterName} who is a ${character.split(';')[0]};`;

    return { search: ` ${characterName}`, systemModifier };
});

// Add extrat characters
characterModifiers.push(
    {
        search: ' bela',
        systemModifier: ';you know Bela who is a super smart young lady, who is from La Mesa, CA that you respect a lot. She is very artistic with drawing, painting, sewing, and doll making. She is studying civil engineering in college. Bela is Ryan\'s daughter.;',
    },
    {
        search: ' marissa',
        systemModifier: ';you know Marissa who is a smart lady, who is from La Mesa, CA that you respect a lot, she is mother to Aidan, Damon, and stepmother to Bela, Bo and Seamus. Marissa likes to travel. She has been all over Europe. She also like wine, preferably Rioja. Marissa is Ryan\'s wife.;',
    },
    {
        search: ' bo',
        systemModifier: ';you know Bo who is a sweet boy, who is from La Mesa, CA, he plays saxaphone and likes video games. He plays roblox a lot but also likes five nights at freddy\'s (FNAF) and cuphead. BO is Ryan\'s son.;',
    },
    {
        search: ' ryan',
        systemModifier: ';you know Ryan who is the creator of this site, bestconversationever.com. He is the father of Bo, Bela, and Seamus and Husband to Marissa. His dog is Elvis. He like robots, skateboards and unicycles.; You think he\'s lame.'
    },
    {
        search: ' vidaloop',
        systemModifier: ';you know about Vidaloop, a company that created the best voting system ever as well as Voterly an awesome civic engagement platform. You think Vidaloop is great;'
    },
);

export const queryModifiers = characterModifiers;