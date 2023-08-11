<script lang="ts">
	import { rantStore } from '$lib/stores';
	import { fade } from 'svelte/transition';

	let rantLink: HTMLAnchorElement;

	const onKeyUp = (e: KeyboardEvent) => {
		if (e.keyCode === 13) {
			rantLink.click();
		}
	};
</script>

<div class="hero" in:fade={{ duration: 400 }}>
	<div class="hero-content text-center">
		<div class="">
			<h1 class="text-5xl font-bold">Know one cares what you have to say?</h1>
			<p class="py-6">
				Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
				quasi. In deleniti eaque aut repudiandae et a id nisi.Provident cupiditate voluptatem et in.
				Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut
				repudiandae et a id nisi.Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
				excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.
			</p>
			<div class="w-full">
				<input
					type="text"
					name="rant"
					placeholder="What do you have to say?"
					class="input input-bordered lg:w-3/5 text-xl mt-2"
					bind:value={$rantStore}
					on:keyup={onKeyUp}
				/>
				<a
					href="/rant/anyone"
					bind:this={rantLink}
					class="btn btn-secondary lg:w-1/5 lg:text-lg ml-2 mt-2 {$rantStore ? '' : 'btn-disabled'}"
				>
					Start Chatting
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 16 16"
						fill="none"
						class="h-4 w-4 m-1 md:m-0"
						stroke-width="2"
						><path
							d="M.5 1.163A1 1 0 0 1 1.97.28l12.868 6.837a1 1 0 0 1 0 1.766L1.969 15.72A1 1 0 0 1 .5 14.836V10.33a1 1 0 0 1 .816-.983L8.5 8 1.316 6.653A1 1 0 0 1 .5 5.67V1.163Z"
							fill="currentColor"
						/></svg
					>
				</a>
			</div>
		</div>
	</div>
</div>
