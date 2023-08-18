
export interface User {
    type: 'authenticated' | 'anonymous'
    name: string;
    id: string;
    avatarUrl: string;
}
