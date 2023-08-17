import type { Session, User } from '$lib/session';
import { nanoid } from 'nanoid'
import { writable, get, type Writable, type Unsubscriber } from "svelte/store";


class SessionStore {
    private readonly USER_KEY = 'u';
    private readonly SESSION_KEY = 's';

    public store: Writable<Session>;

    public subscribe: Unsubscriber;

    constructor() {

        const user = this.createNewUser();
        const session = this.createNewSession(user);

        this.store = writable<Session>(session);

        this.subscribe = this.store.subscribe;
    }

    // public async init(): Promise<Session> {
    //     // const userData = localStorage?.getItem(this.USER_KEY);
    //     // const user = userData ? JSON.parse(userData) : this.createNewUser();

    //     // if (localStorage) {
    //     //     localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    //     // }

    //     const user = this.createNewUser();
    //     const session  = this.createNewSession();

    //     const sessionData = sessionStorage?.getItem(this.SESSION_KEY);
    //     const session = sessionData ? JSON.parse(sessionData) : this.createNewSession(user);
    //     if (sessionStorage) {
    //         sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    //     }

    //     if (session.userId !== user.id) {
    //         throw new Error('Invalid Session');
    //     }

    //     await this.set(session);

    //     return session;
    // }

    public async set(session: Session): Promise<void> {
        this.store.update((v) => session);
    }

    public createNewSession(user: User): Session {
        return {
            id: nanoid(12),
            user,
            start: new Date(),
        }
    }

    private createNewUser(): User {
        return {
            id: nanoid(12),
            name: 'Anonymous',
            type: 'anonymous',
            avatarUrl: '/images/user/missing-user.jpg',
        }
    }
}

export const session = new SessionStore();
