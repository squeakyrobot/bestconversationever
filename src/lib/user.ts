
export enum SettingsQueryModifier {
    Normal = 0,
    Extra = 1,
    Absurd = 2,
}

export type UserSettings = {
    goatFreq: SettingsQueryModifier;
    robotFreq: SettingsQueryModifier;
    skateboardFreq: SettingsQueryModifier;
    unicycleFreq: SettingsQueryModifier;
}

export enum UserType {
    Anonymous = 0,
    Authenticated = 2,
}

export type User = {
    type: UserType;
    name: string;
    id: string;
    avatarUrl: string;
    settings: UserSettings;
}
