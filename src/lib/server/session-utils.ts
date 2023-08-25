import { SettingsQueryModifier, UserType } from "../user";
import { SESSION_DAYS, SESSION_KEY_1 } from "$env/static/private";
import { base64url } from '@scure/base';
import { nanoid } from "nanoid";
import type { Session } from "$lib/session";
import { aesGcmDecrypt, aesGcmEncrypt } from "./node-crypto";

const defaultUserName = 'Anonymous';
const defaultAvatar = '/images/user/missing-user.jpg';

export async function getSession(sessionData?: string): Promise<Session> {
    const expires = (parseInt(SESSION_DAYS || "7", 10) * 8.64e+7) + Date.now();

    try {
        if (sessionData) {
            const session = await unpackSession(sessionData);

            // Migration
            if (!session.user.settings) {
                session.user.settings = {
                    goatFreq: SettingsQueryModifier.Normal,
                    robotFreq: SettingsQueryModifier.Normal,
                    skateboardFreq: SettingsQueryModifier.Normal,
                    unicycleFreq: SettingsQueryModifier.Normal,
                };
            }

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
        version: 1,
        id: nanoid(12),
        expires,
        user: {
            id: nanoid(12),
            name: defaultUserName,
            type: UserType.Anonymous,
            avatarUrl: defaultAvatar,
            settings: {
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
        v: session.version,
        i: session.id,
        e: session.expires,
        u: {
            i: session.user.id,
            n: (session.user.name === defaultUserName) ? undefined : session.user.name,
            t: session.user.type,
            a: (session.user.avatarUrl === defaultAvatar) ? undefined : session.user.avatarUrl,
            s: {
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
        version: minified.v || 1,
        id: minified.i,
        expires: minified.e,
        user: {
            id: minified.u.i,
            name: minified.u.n || defaultUserName,
            type: minified.u.t,
            avatarUrl: minified.u.a || defaultAvatar,
            settings: {
                goatFreq: minified.u.s?.g || SettingsQueryModifier.Normal,
                robotFreq: minified.u.s?.r || SettingsQueryModifier.Normal,
                skateboardFreq: minified.u.s?.s || SettingsQueryModifier.Normal,
                unicycleFreq: minified.u.s?.u || SettingsQueryModifier.Normal,
            },
        }
    }
}