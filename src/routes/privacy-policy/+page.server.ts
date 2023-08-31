import type { PageServerLoad } from "../$types";
import { parse } from 'marked';
import * as fs from 'fs';

export const prerender = true;

export const load = (() => {
    const policy = parse(fs.readFileSync('static/policies/privacy-policy.md', 'utf8'));

    return {
        policy,
        pageTitle: 'Privacy Policy',
        pageDescription: 'Best Conversation Ever Privacy Policy',
        pageOgImage: undefined,
    };


}) satisfies PageServerLoad;
