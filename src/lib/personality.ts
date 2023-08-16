import { getEnumKey, randomEnum } from "./util";

export enum Person {
    Brody = 'fitness enthusiast; you\'re named Brody;',
    Chad = 'jock; you\'re named Chad;',
    Dean = 'Disappointed father; you\'re named Dean;',
    Doc = 'mad scientist; you\'re named Doc;',
    Elvis = 'sheep dog nam,ed Elvis; only responds with woofs, barks, growls, and an occasional howl; no translations;no english;',
    Emma = 'foodie; you\'re named Emma;',
    Felix = 'hipster; you\'re named Felix;',
    Gramps = 'bitter old man; angry; responds briefly;; you\'re named Gramps;',
    Kai = 'beach bum; you\'re named Kai;',
    Luna = 'goth; you\'re named Luna;',
    Navin = 'jerk; you\'re named Navin;',
    Rob = 'Sleazy politician; corrupt; republican;',
    Sam = 'just like Samuel L. Jackson; you\'re named Sam;',
    Sheryl = 'Disappointed mother; you\'re named Sheryl;',
    Sky = 'hippie; you\'re named Sky;',
    Sophia = 'fashionista; you\'re named Sophia;',
    Steve = 'metalhead; you\'re named Steve;',
    Tiffany = 'valley girl; you\'re named Tiffany;',
    Willis = 'raging alcholic; mumbles; responds briefly;; you\'re named Willis;',
}

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
    Person = 1,
    Mood = 2,
    Relationship = 4,
    ResponseLength = 8,
}

export interface PersonalityOptions {
    person: Person;
    name: string;
    mood: Mood;
    relationship: Relationship;
    responseLength: ResponseLength;
}

export class Personality {
    private traitLock = Traits.None;

    public constructor(private options?: Partial<PersonalityOptions>) {
        if (options?.person) {
            this.traitLock |= Traits.Person;
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

    public get person(): Person {
        return ((this.traitLock & Traits.Person) && this.options?.person) ?
            this.options.person :
            randomEnum(Person);
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

    public getName(person: Person): string {
        const name = getEnumKey(Person, person);

        return name || '???';
    }


    public export(): PersonalityOptions {
        const person = this.person;
        const name = this.getName(person);

        return {
            name,
            person,
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

        if (traits & Traits.Person) {
            this.options.person = this.person;
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