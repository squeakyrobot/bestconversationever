
export enum GoatFrequency {
    Normal = 0,
    Absurd = 1,
}

export interface UserSettings {
    goatFreq: GoatFrequency;
}

export interface User {
    type: 'authenticated' | 'anonymous'
    name: string;
    id: string;
    avatarUrl: string;
    settings: UserSettings;
}
