<script lang="ts">
	import CharacterList from '$lib/components/CharacterList.svelte';
	import ContactForm from '$lib/components/ContactForm.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import SigninHeader from '$lib/components/SigninHeader.svelte';
	import type { PageData } from './$types';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { applyAction } from '$app/forms';
	import { fade } from 'svelte/transition';
	import { getRecaptchaToken, handlePageRecaptcha, recaptchaVerify } from '$lib/recaptcha-client';
	import { onMount } from 'svelte';

	// export let form: FormData;
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
	<SigninHeader />

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
					personalities.
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
		<div class="mt-10">
			<strong>Hint:</strong>
			<em
				>If you are looking for real help, try
				<a href="/chat/randy" class="link">Randy</a>.</em
			>
		</div>
		<h2 class="text-3xl lg:text-4xl font-bold pt-10">Credits & Thanks</h2>
		<div class="py-6 ml-5 text-lg">
			<ul class="list-disc">
				<li>
					<strong>Bela</strong> - My daughter had great ideas for the characters and did some initial
					QA
				</li>
				<li>
					<strong>Shaun</strong> - Asked for more goats
				</li>
				<li>
					<a class="link link-primary" href="https://getavataaars.com/" target="_blank">
						avataaars generator
					</a>
					- A great tool for whipping up some custom avatars!
				</li>

				<li>
					<a class="link link-primary" href="https://getavataaars.com/" target="_blank">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							height="1em"
							viewBox="0 0 448 512"
							fill="currentColor"
							stroke="currentColor"
							class="inline mr-2"
							><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path
								d="M448 48V384c-63.1 22.5-82.3 32-119.5 32c-62.8 0-86.6-32-149.3-32c-20.6 0-36.6 3.6-51.2 8.2v-64c14.6-4.6 30.6-8.2 51.2-8.2c62.7 0 86.5 32 149.3 32c20.4 0 35.6-3 55.5-9.3v-208c-19.9 6.3-35.1 9.3-55.5 9.3c-62.8 0-86.6-32-149.3-32c-50.8 0-74.9 20.6-115.2 28.7V448c0 17.7-14.3 32-32 32s-32-14.3-32-32V64C0 46.3 14.3 32 32 32s32 14.3 32 32V76.7c40.3-8 64.4-28.7 115.2-28.7c62.7 0 86.5 32 149.3 32c37.1 0 56.4-9.5 119.5-32z"
							/></svg
						>Font Awesome
					</a> - The name says it all
				</li>
			</ul>
		</div>

		<ContactForm formSubmitted={data.formSubmitted} />
		<a href="/" class="link link-primary text-xl lg:text-2xl">Back Home</a><br />
	</div>
	<Footer disabled={true} showVersion={true} />
</div>
