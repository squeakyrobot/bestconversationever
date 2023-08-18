import type { User } from "./user";
import { SESSION_DAYS } from "$env/static/private";
import { base64 } from '@scure/base';
import { nanoid } from "nanoid";

export interface Session {
    id: string;
    expires: number;
    user: User;
}

export function getSession(sessionData?: string): Session {
    const expires = (parseInt(SESSION_DAYS || "7", 10) * 8.64e+7) + Date.now();

    try {
        if (sessionData) {
            const session = JSON.parse((new TextDecoder()).decode(base64.decode(sessionData))) as Session;

            if (session.expires < expires) {
                session.expires = expires;
                return session;
            }
        }
    } catch (e) {
        console.error('Failed to unpack session');
    }

    return {
        id: nanoid(12),
        expires,
        user: {
            id: nanoid(12),
            name: 'Anonymous',
            type: 'anonymous',
            avatarUrl: '/images/user/missing-user.jpg',
        }
    }
}

export function packSession(session: Session): string {
    return base64.encode((new TextEncoder()).encode(JSON.stringify(session)));
}

