import { SettingsQueryModifier, UserType, defaultAvatar, defaultUserName } from "../user";
import { SESSION_DAYS, SESSION_KEY_1 } from "$env/static/private";
import { base64url } from '@scure/base';
import type { Session } from "$lib/session";
import { aesGcmDecrypt, aesGcmEncrypt } from "./crypto";
import { newId } from "$lib/util";

export async function getSession(sessionData?: string): Promise<Session> {
    const expires = (parseInt(SESSION_DAYS || "7", 10) * 8.64e+7) + Date.now();

    try {
        if (sessionData) {
            const session = await unpackSession(sessionData);

            // If the session has not expired, update the expiration date
            // Otherwise it will proceed to creating a new session
            if (session.expires < expires) {
                session.expires = expires;
                return session;
            }
        }
    } catch (e) {
        console.error('Failed to unpack session', e);
    }

    return {
        authenticated: false,
        accountId: '',
        authTime: 0,
        expires,
        id: newId(),
        version: 1,
        user: {
            id: newId(),
            type: UserType.Anonymous,
            settings: {
                avatarUrl: defaultAvatar,
                useAvatarImage: true,
                displayName: defaultUserName,
                showAvatarInChat: true,
                goatFreq: SettingsQueryModifier.Normal,
                robotFreq: SettingsQueryModifier.Normal,
                skateboardFreq: SettingsQueryModifier.Normal,
                unicycleFreq: SettingsQueryModifier.Normal,
            },
        }
    }
}

/**
 * This packing is probably overkill and premature optimization but its here 
 * and makes the cookie a little smaller 
 * @param session 
 * @returns 
 */
export async function packSession(session: Session): Promise<string> {
    const minified = {
        a: session.authenticated,
        as: session.accountId,
        at: session.authTime,
        e: session.expires,
        i: session.id,
        v: session.version,
        u: {
            i: session.user.id,
            t: session.user.type,
            s: {
                a: (session.user.settings.avatarUrl === defaultAvatar) ? undefined : session.user.settings.avatarUrl,
                ua: session.user.settings.useAvatarImage,
                n: (session.user.settings.displayName === defaultUserName) ? undefined : session.user.settings.displayName,
                sa: session.user.settings.showAvatarInChat,
                g: session.user.settings.goatFreq,
                r: session.user.settings.robotFreq,
                s: session.user.settings.skateboardFreq,
                u: session.user.settings.unicycleFreq,
            }
        }
    }

    return base64url.encode(
        await aesGcmEncrypt(
            base64url.decode(SESSION_KEY_1),
            (new TextEncoder()).encode(JSON.stringify(minified))
        )
    );
}

async function unpackSession(sessionData: string): Promise<Session> {
    const minified = JSON.parse(
        (new TextDecoder()).decode(
            await aesGcmDecrypt(
                base64url.decode(SESSION_KEY_1),
                base64url.decode(sessionData)))
    );

    return {
        authenticated: minified.a,
        accountId: minified.as,
        authTime: minified.at,
        expires: minified.e,
        id: minified.i,
        version: minified.v || 1,
        user: {
            id: minified.u.i,
            type: minified.u.t,
            settings: {
                avatarUrl: minified.u.s?.a || defaultAvatar,
                useAvatarImage: minified.u.s?.ua,
                displayName: minified.u.s?.n || defaultUserName,
                showAvatarInChat: minified.u.s?.sa,
                goatFreq: minified.u.s?.g || SettingsQueryModifier.Normal,
                robotFreq: minified.u.s?.r || SettingsQueryModifier.Normal,
                skateboardFreq: minified.u.s?.s || SettingsQueryModifier.Normal,
                unicycleFreq: minified.u.s?.u || SettingsQueryModifier.Normal,
            },
        }
    }
}