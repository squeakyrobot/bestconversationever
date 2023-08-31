import type { PageServerLoad } from "../$types";
import { parse } from 'marked';
import * as fs from 'fs';

export const prerender = true;

export const load = (() => {
    const policy = parse(fs.readFileSync('static/policies/cookie-policy.md', 'utf8'));

    return {
        policy,
        pageTitle: 'Cookie Policy',
        pageDescription: 'Best Conversation Ever Cookie Policy',
        pageOgImage: undefined,
    };


}) satisfies PageServerLoad;
