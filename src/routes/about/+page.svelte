<script lang="ts">
	import CharacterList from '$lib/components/CharacterList.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import type { PageData } from './$types';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { applyAction, enhance } from '$app/forms';
	import { fade } from 'svelte/transition';
	import { getRecaptchaToken, handlePageRecaptcha, recaptchaVerify } from '$lib/recaptcha-client';
	import { onMount } from 'svelte';

	export let form: FormData;
	export let data: PageData;

	let formLoading = false;

	onMount(async () => {
		handlePageRecaptcha(await recaptchaVerify('page_view/about'));
	});

	const contactSubmit: SubmitFunction = async ({ formData }) => {
		formLoading = true;
		formData.set('token', await getRecaptchaToken('contact/submit'));

		return async ({ result }) => {
			await applyAction(result);
			formLoading = false;
		};
	};
</script>

<div
	class="flex flex-col w-full lg:w-3/4 max-w-6xl border-opacity-50 p-4 h-full"
	in:fade={{ duration: 400 }}
>
	<div class="hero mt-20">
		<div class="hero-content flex-col md:flex-row">
			<img src="/images/bce-logo.svg" alt="BCE Logo" class="md:w-1/3 w-2/5" />
			<div class="md:pl-10">
				<h1 class="text-center md:text-left text-3xl lg:text-5xl font-bold">
					Best Conversation Ever!
				</h1>
				<p class="py-6 text-lg">
					A site where you can have captivating conversations with various
					<abbr title="Artificial Intelligence">AI</abbr>
					personalities. But beware! We save all the messages so we can show them to your friends, family,
					colleagues, and neighbors. The voyeur section should be coming soon.
				</p>
			</div>
		</div>
	</div>

	<div class="flex-grow mt-10">
		<h2 class="text-3xl lg:text-4xl font-bold">Why?</h2>
		<p class="py-6 text-lg">
			Why not? 🤷️<br />
		</p>
		<h2 class="text-3xl lg:text-4xl font-bold pt-10">About the Characters</h2>
		<p class="py-6 text-lg">
			The characters each have a different set personality as well as some randomness with each
			response. The random elements are things like their mood and thier feelings or relationship
			towards the user chatting with them. All the characters know each other very well and the best
			way to learn about their personalities is to ask someone.
			<br /><br />
			Just click on someone and say something like, <em>"Tell me about Rob"</em>.
		</p>
		<div class="lg:text-center">
			<CharacterList />
		</div>

		<h2 class="text-3xl lg:text-4xl font-bold pt-10">Credits & Thanks</h2>
		<div class="py-6 ml-5 text-lg">
			<ul class="list-disc">
				<li>
					<strong>Bela</strong> - My daughter had great ideas for the characters and did some initial
					QA
				</li>
				<li>
					<a class="link link-primary" href="https://getavataaars.com/" target="_blank">
						avataaars generator
					</a>
					- A great tool for whipping up some custom avatars!
				</li>
				<li>
					<strong>Shaun</strong> - Asked for more goats
				</li>
			</ul>
		</div>

		<h2 class="text-3xl lg:text-4xl font-bold pt-10">Contact</h2>

		{#if formLoading === true}
			<div class=" max-w-screen-md mt-10 mb-20" out:fade in:fade>
				<span class="loading loading-dots loading-lg" />
			</div>
		{:else if !form && !data.formSubmitted}
			<div class=" max-w-screen-md mb-20" out:fade>
				<p class="py-6 text-lg">
					Got a technical issue? Want to send feedback about your experience? Let us a message.
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
		{:else if form?.success === false}
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
				<span>There was an error sending your message. {form?.message || ''}</span>
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
				<span>Your message was sent</span>
			</div>
		{/if}
		<a href="/" class="link link-primary text-xl lg:text-2xl">Back Home</a>
	</div>
	<Footer disabled={true} showVersion={true} />
</div>
