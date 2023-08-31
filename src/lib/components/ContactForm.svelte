<script lang="ts">
	import type { SubmitFunction } from '@sveltejs/kit';
	import { applyAction, enhance } from '$app/forms';
	import { fade } from 'svelte/transition';
	import { getRecaptchaToken } from '$lib/recaptcha-client';

	export let formSubmitted = false;
	let formData: FormData;

	let formLoading = false;

	const contactSubmit: SubmitFunction = async ({ formData }) => {
		formLoading = true;
		formData.set('token', await getRecaptchaToken('contact/submit'));

		return async ({ result }) => {
			await applyAction(result);
			formLoading = false;

			if (result.data?.success === true) {
				formSubmitted = true;
			}
		};
	};
</script>

<h2 class="text-3xl lg:text-4xl font-bold pt-10">Contact</h2>

{#if formLoading === true}
	<div class=" max-w-screen-md mt-10 mb-20" out:fade in:fade>
		<span class="loading loading-dots loading-lg" />
	</div>
{:else if !formData && !formSubmitted}
	<div class=" max-w-screen-md mb-20" out:fade>
		<p class="py-6 text-lg">
			Got a technical issue? Want to send feedback about your experience? Leave us a message.
		</p>
		<form method="POST" class="space-y-8" use:enhance={contactSubmit}>
			<div>
				<label for="email" class="font-bold">Your Email</label>
				<input
					type="email"
					id="email"
					name="email"
					class="input input-bordered w-full mt-2"
					placeholder="name@example.com"
					required
				/>
			</div>
			<div>
				<label for="subject" class="font-bold">Subject</label>
				<input
					type="text"
					id="subject"
					name="subject"
					class="input input-bordered w-full mt-2"
					placeholder="Let us know what this is all about"
					required
				/>
			</div>
			<div class="sm:col-span-2">
				<label for="message" class="font-bold">Your Message</label>
				<textarea
					id="message"
					name="message"
					rows="6"
					class="textarea textarea-bordered w-full mt-2"
					placeholder="Leave your message..."
					required
				/>
			</div>
			<input name="token" id="token" type="hidden" />
			<button type="submit" class="btn btn-neutral">Send message</button>
		</form>
	</div>
{:else if formData?.success === false}
	<div class="alert alert-error mt-10 mb-20" in:fade>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="stroke-current shrink-0 h-6 w-6"
			fill="none"
			viewBox="0 0 24 24"
			><path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
			/></svg
		>
		<span>There was an error sending your message. {formData?.message || ''}</span>
	</div>
{:else}
	<div class="alert alert-info mt-10 mb-20" in:fade>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			class="stroke-current shrink-0 w-6 h-6"
			><path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
			/></svg
		>
		<span>Your message was sent. You can send one message per day.</span>
	</div>
{/if}
