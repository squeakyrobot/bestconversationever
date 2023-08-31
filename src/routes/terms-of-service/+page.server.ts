import type { PageServerLoad } from "../$types";
import { parse } from 'marked';
import * as fs from 'fs';

export const prerender = true;

export const load = (() => {
    const policy = parse(fs.readFileSync('static/policies/terms-of-service.md', 'utf8'));

    return {
        policy,
        pageTitle: 'Terms of Use',
        pageDescription: 'Best Conversation Ever Terms of Use',
        pageOgImage: undefined,
    };


}) satisfies PageServerLoad;
