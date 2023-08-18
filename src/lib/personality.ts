import { getEnumKey, randomEnum } from "./util";

export enum Character {
    Brody = 'fitness enthusiast; you are named Brody;',
    Chad = 'jock; you are named Chad;',
    Dean = 'Disappointed father; you are named Dean;',
    Doc = 'mad scientist; you are named Doc;',
    Elvis = 'sheep dog named Elvis; only responds with woofs, barks, growls, and an occasional howl; no translations; no english; You are Ryan and Marissa\'s dog;',
    Emma = 'foodie; you are named Emma;',
    Felix = 'hipster; you are named Felix;',
    Gramps = 'bitter old man; angry; responds briefly; you are named Gramps;',
    Kai = 'beach bum; you are named Kai;',
    Luna = 'goth; you are named Luna;',
    Navin = 'jerk; you are named Navin;',
    Rob = 'Sleazy politician; corrupt; republican;',
    Sam = 'just like Samuel L. Jackson; you are named Sam;',
    Sheryl = 'Disappointed mother; you are named Sheryl;',
    Sky = 'hippie; you are named Sky;',
    Sophia = 'fashionista; you are named Sophia;',
    Steve = 'metalhead; you are named Steve;',
    Tiffany = 'valley girl; you are named Tiffany;',
    Willis = 'raging alcoholic; mumbles; responds briefly; you are named Willis;',
};

export enum Mood {
    None = '',
    Sarcastic = 'sarcastic',
    Angry = 'pissed off',
    Disappointed = 'disappointed',
    Happy = 'ecstatic',

}

export enum Relationship {
    Stranger = 'stranger',
    Acquaintance = 'acquaintance',
    Enemy = 'enemy',
    Nemesis = 'nemesis',
}

export enum ResponseLength {
    Short = '1-2 sentences',
    Medium = '2-3 sentences',
    Long = '3-4 sentences'
}

export enum Traits {
    None = 0,
    Character = 1,
    Mood = 2,
    Relationship = 4,
    ResponseLength = 8,
}

export interface PersonalityOptions {
    character: Character;
    name: string;
    mood: Mood;
    relationship: Relationship;
    responseLength: ResponseLength;
}

export class Personality {
    private traitLock = Traits.None;

    public constructor(private options?: Partial<PersonalityOptions>) {
        if (options?.character) {
            this.traitLock |= Traits.Character;
        }

        if (options?.mood) {
            this.traitLock |= Traits.Mood;
        }

        if (options?.relationship) {
            this.traitLock |= Traits.Relationship;
        }

        if (options?.responseLength) {
            this.traitLock |= Traits.ResponseLength;
        }
    }

    public get character(): Character {
        return ((this.traitLock & Traits.Character) && this.options?.character) ?
            this.options.character :
            randomEnum(Character);
    }

    public get mood(): Mood {
        return (this.traitLock & Traits.Mood && this.options?.mood) ?
            this.options.mood :
            randomEnum(Mood);
    }

    public get relationship(): Relationship {
        return (this.traitLock & Traits.Relationship && this.options?.relationship) ?
            this.options.relationship :
            randomEnum(Relationship);
    }

    public get responseLength(): ResponseLength {
        return (this.traitLock & Traits.ResponseLength && this.options?.responseLength) ?
            this.options.responseLength :
            randomEnum(ResponseLength);
    }

    public getName(character: Character): string {
        const name = getEnumKey(Character, character);

        return name || '???';
    }


    public export(): PersonalityOptions {
        const character = this.character;
        const name = this.getName(character);

        return {
            name,
            character,
            mood: this.mood,
            relationship: this.relationship,
            responseLength: this.responseLength,
        };
    }

    public toJSON(): PersonalityOptions {
        return this.export();
    }

    public toString(): string {
        return JSON.stringify(this);
    }

    public lock(traits: Traits): void {
        this.options = this.options || {};

        if (traits & Traits.Character) {
            this.options.character = this.character;
        }

        if (traits & Traits.Mood) {
            this.options.mood = this.mood;
        }

        if (traits & Traits.Relationship) {
            this.options.relationship = this.relationship;
        }

        if (traits & Traits.ResponseLength) {
            this.options.responseLength = this.responseLength;
        }

        this.traitLock |= traits;
    }
}
