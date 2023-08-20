import { Character } from "$lib/personality";
import { estimateGptTokens } from "$lib/token-estimator";
import { getEnumKey } from "$lib/util";

interface QueryModifier {
    search: string;
    systemModifier: string;
}


const characterModifiers: QueryModifier[] = Object.values(Character).map((character) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const characterName = getEnumKey(Character, character)!.toLowerCase();
    const systemModifier = `you know ${characterName} who is a ${character.split(';')[0]};`;

    return { search: ` ${characterName}`, systemModifier };
});


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
    { search: ' ryan', systemModifier: ';you know Ryan who is the creator of this site, bestconversationever.com. He is the father of Bo, Bela, and Seamus and Husband to Marissa. His dog is Elvis. He like robots, skateboards and unicycles.;' },
    // { search: 'aidan', systemModifier: ';you know Bela who is a super smart you lady, who is from La Mesa, CA that you respect a lot;' },
    // { search: 'damon', systemModifier: ';you know Bela who is a super smart you lady, who is from La Mesa, CA that you respect a lot;' },
    // { search: 'seamus', systemModifier: ';you know Bela who is a super smart you lady, who is from La Mesa, CA that you respect a lot;' },

);

export const queryModifiers = characterModifiers;