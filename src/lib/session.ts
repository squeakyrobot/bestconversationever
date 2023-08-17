export interface User {
    type: 'authenticated' | 'anonymous'
    name: string;
    id: string;
    avatarUrl: string;
}

export interface Session {
    id: string;
    start: Date;
    end?: Date;
    user: User;
}

