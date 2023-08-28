
export const defaultUserName = 'Anonymous';
export const defaultAvatar = '/images/user/missing-user.jpg';

export enum SettingsQueryModifier {
    Normal = 0,
    Extra = 1,
    Absurd = 2,
}

export type UserSettings = {
    avatarUrl: string;
    useAvatarImage: boolean;
    displayName: string;
    showAvatarInChat: boolean;
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
    id: string;
    settings: UserSettings;
    type: UserType;
}
