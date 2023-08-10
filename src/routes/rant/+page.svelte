<script lang="ts">
	import NavigationLinks from '../NavigationLinks.svelte';
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	export let form: ActionData;
</script>

<h1>Rant</h1>

<form method="POST" action="?/getResponse" use:enhance>
	<textarea name="rant">{form?.rant}</textarea>
	<button type="submit">Go!</button>
</form>

<p><b title={form?.prompt}>{form?.personName || '[auto]'}: </b></p>

<div class="response">{form?.response}</div>

<NavigationLinks />

<style>
	textarea {
		width: 800px;
		height: 300px;
		display: block;
	}

	.response {
		width: 800px;
		font-size: 1.5em;
	}
</style>
