// See https://kit.svelte.dev/docs/types#app

import type { Session } from "$lib/session";
import type { User } from "$lib/user";

// for information about these interfaces
declare global {
	namespace App {
		interface Error {
			code?: string;
			id?: string;
			message: string;
		}
		interface Locals {
			session: Session,
		}
		interface PageData {
			user: User,
			pageTitle: string,
			pageDescription: string,
		}
		// interface Platform {}
	}
}

// App version
declare const __VERSION__: string
// Date of last commit
declare const __LASTMOD__: string


export { };
