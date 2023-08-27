import type { User } from "./user";

export interface Session {
    authenticated: boolean;
    accountId: string;
    authTime: number;
    expires: number;
    id: string;
    user: User;
    version: number;
}

