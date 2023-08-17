import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { exec } from 'child_process'
import { promisify } from 'util'

// Get current tag/commit and last commit date from git
const pexec = promisify(exec)
const [version, lastmod] = (
	await Promise.all([
		pexec('git describe --tags || git rev-parse --short HEAD'),
		pexec('git log -1 --format=%cd --date=format:"%Y-%m-%d %H:%M:%S"'),
	])
).map(v => JSON.stringify(v.stdout.trim()));

console.log('VITE CONFIG');

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	define: {
		__VERSION__: version,
		__LASTMOD__: lastmod,
	}
});
