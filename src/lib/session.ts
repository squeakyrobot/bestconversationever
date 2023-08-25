import type { User } from "./user";

export interface Session {
    version: number;
    id: string;
    expires: number;
    user: User;
}

