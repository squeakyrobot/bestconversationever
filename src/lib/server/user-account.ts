import { UserType, defaultAvatar, defaultUserName, type User } from "$lib/user";
import { newId } from "$lib/util";

export type AuthenticatorName = 'google' | 'email';

export type UserAccount = {
    id: string;
    authSources: AuthenticatorInfo[];
    primaryEmail?: string;
    primaryEmailVerified: boolean;
    profileSource: 'custom' | AuthenticatorName,
    user: User;
}

export type AuthenticatorInfo = {
    authenticator: AuthenticatorName;
    email?: string;
    emailVerified: boolean;
    id: string;
    name?: string;
    phone?: string;
    picture?: string;
}

export function createFromAuthInfo(user: User, authInfo: AuthenticatorInfo): UserAccount {

    const userAccount: UserAccount = {
        id: newId(),
        authSources: [authInfo],
        primaryEmail: authInfo.email || undefined,
        primaryEmailVerified: authInfo.emailVerified || false,
        profileSource: 'google',
        user: user,
    }

    userAccount.user.avatarUrl = authInfo.picture || defaultAvatar;
    userAccount.user.displayName = authInfo.name || defaultUserName;
    userAccount.user.type = UserType.Authenticated;

    return userAccount;
}

export function updateFromAuthInfo(userAccount: UserAccount, authInfo: AuthenticatorInfo): UserAccount {
    const sourceIdx = userAccount.authSources ?
        userAccount.authSources.findIndex((v) => v.authenticator === authInfo.authenticator) :
        -1;

    if (sourceIdx > -1) {
        userAccount.authSources[sourceIdx] = authInfo;
    }
    else {
        userAccount.authSources.push(authInfo);
    }

    // If profile source is the same as the authInfo then update it
    if (userAccount.profileSource === authInfo.authenticator) {
        userAccount.user.avatarUrl = authInfo.picture || userAccount.user.avatarUrl || defaultAvatar;
        userAccount.user.displayName = authInfo.name || userAccount.user.displayName || defaultUserName;
        userAccount.primaryEmail = authInfo.email || undefined;
        userAccount.primaryEmailVerified = authInfo.emailVerified;
    }

    // things that should always be set
    userAccount.user.type = UserType.Authenticated;

    return userAccount;
}