import { SettingsQueryModifier, UserType, type User } from "./user";
import { SESSION_DAYS } from "$env/static/private";
import { base64 } from '@scure/base';
import { nanoid } from "nanoid";

const defaultUserName = 'Anonymous';
const defaultAvatar = '/images/user/missing-user.jpg';

export interface Session {
    version: number;
    id: string;
    expires: number;
    user: User;
}

export function getSession(sessionData?: string): Session {
    const expires = (parseInt(SESSION_DAYS || "7", 10) * 8.64e+7) + Date.now();

    try {
        if (sessionData) {
            const session = unpackSession(sessionData);

            console.log('UNPACKED SESSION: ', session);

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

    console.log('SESSION: Returning NEW session');

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
export function packSession(session: Session): string {
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

    return base64.encode((new TextEncoder()).encode(JSON.stringify(minified)));
}

function unpackSession(sessionData: string): Session {
    const minified = JSON.parse((new TextDecoder()).decode(base64.decode(sessionData)));

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