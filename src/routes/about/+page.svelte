<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import { fade } from 'svelte/transition';
	import { handlePageRecaptcha, recaptchaVerify } from '$lib/recaptcha-client';
	import { onMount } from 'svelte';

	onMount(async () => {
		handlePageRecaptcha(await recaptchaVerify('page_view/about'));
	});
</script>

<div class="flex flex-col w-full lg:w-3/4 border-opacity-50 p-4 h-full" in:fade={{ duration: 400 }}>
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
			Actually, this site started as a small sample app because I wanted to try out SvelteKit. I also
			wanted to play with OpenAI’s ChatGPT API so I set off to make a simple chat app just like Chat
			GPT. Initially it was going to be a quick throw away experiment to try out a few new things. Next
			thing I know, I have been nerding out way longer than planned and this is what came out. It happens.
		</p>
		<h2 class="text-3xl lg:text-4xl font-bold">Credits & Thanks</h2>
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
			</ul>

			<!-- <h3 class="text-2xl lg:text-3xl font-bold mt-5">Primary Technologies Used</h3>
			<div class="py-6 ml-10 text-lg">
				<ul class="list-disc">
					<li>
						<a class="link link-primary" href="https://kit.svelte.dev/" target="_blank">SvelteKit</a
						>
					</li>
					<li>
						<a
							class="link link-primary"
							href="https://platform.openai.com/docs/guides/gpt"
							target="_blank">OpenAI GPT</a
						>
					</li>
					<li>
						<a class="link link-primary" href="https://tailwindcss.com/" target="_blank"
							>Tailwind CSS</a
						>
					</li>
					<li>
						<a class="link link-primary" href="https://daisyui.com/" target="_blank">daisyUI</a>
					</li>
				</ul>
			</div> -->
		</div>

		<h2 class="text-3xl lg:text-4xl font-bold">Contact</h2>
		<p class="py-6 text-lg">TODO</p>

		<a href="/" class="link link-primary text-xl lg:text-2xl">Back Home</a>
	</div>
	<Footer disabled={true} showVersion={true} />
</div>
