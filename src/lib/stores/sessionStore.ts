import type { Session } from "$lib/session";
import { writable } from "svelte/store";

export const userSession = writable<Session>();