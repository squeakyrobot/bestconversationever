<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import { SettingsQueryModifier, type UserSettings } from '$lib/user';
	import { fade } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { returnPage } from '$lib/stores/return-page';
	import { sessionUser } from '$lib/stores/session-user';
	import { updateUserSettings } from '$lib/settings';

	let closeRedirect: string | undefined;

	// TODO: cleanup all this ugly settings stuff
	let selectedGoatFreq = SettingsQueryModifier.Normal;
	let selectedRobotFreq = SettingsQueryModifier.Normal;
	let selectedSkateboardFreq = SettingsQueryModifier.Normal;
	let selectedUnicycleFreq = SettingsQueryModifier.Normal;
	let settings = $sessionUser.settings;

	onMount(() => {
		if (!closeRedirect) {
			closeRedirect = $returnPage;
		}

		if (!settings) {
			settings = {
				goatFreq: SettingsQueryModifier.Normal,
				robotFreq: SettingsQueryModifier.Normal,
				skateboardFreq: SettingsQueryModifier.Normal,
				unicycleFreq: SettingsQueryModifier.Normal
			};

			$sessionUser.settings = settings;
		}

		selectedGoatFreq = settings.goatFreq;
		selectedRobotFreq = settings.robotFreq;
		selectedSkateboardFreq = settings.skateboardFreq;
		selectedUnicycleFreq = settings.unicycleFreq;
	});

	const onClose = () => {
		goto(closeRedirect || '/inbox');
	};

	const saveSettings = async () => {
		const goatFreqSelect = document.querySelector('#goatFreqSelect') as HTMLSelectElement;
		const robotFreqSelect = document.querySelector('#robotFreqSelect') as HTMLSelectElement;
		const skateboardFreqSelect = document.querySelector(
			'#skateboardFreqSelect'
		) as HTMLSelectElement;
		const unicycleFreqSelect = document.querySelector('#unicycleFreqSelect') as HTMLSelectElement;

		const updatedSettings: UserSettings = {
			goatFreq: parseInt(goatFreqSelect.value, 10),
			robotFreq: parseInt(robotFreqSelect.value, 10),
			skateboardFreq: parseInt(skateboardFreqSelect.value, 10),
			unicycleFreq: parseInt(unicycleFreqSelect.value, 10)
		};

		settings = updatedSettings;

		const result = await updateUserSettings(updatedSettings); // TODO: notify of failure

		if (result) {
			$sessionUser.settings = settings;
		} else {
			console.log('Could not update settings');
		}

		goto(closeRedirect || '/inbox');
	};
</script>

<div class="max-w-4xl h-full w-full overflow-hidden" in:fade>
	<div class="flex flex-col overflow-hidden h-full p-2 w-full">
		<Header title="Settings" titleLink={closeRedirect || '/inbox'} />
		<div class="flex-grow overflow-y-auto ml-2">
			<div class="">
				<div class="pl-2 mt-2 mb-1 text-lg">Goats:</div>
				<select
					bind:value={selectedGoatFreq}
					id="goatFreqSelect"
					class="select select-bordered w-full max-w-xs"
				>
					<option value={SettingsQueryModifier.Normal}>Normal</option>
					<option value={SettingsQueryModifier.Extra}>Extra</option>
					<option value={SettingsQueryModifier.Absurd}>Absurd</option>
				</select>

				<div class="pl-2 mt-4 mb-1 text-lg">Robots:</div>
				<select
					bind:value={selectedRobotFreq}
					id="robotFreqSelect"
					class="select select-bordered w-full max-w-xs"
				>
					<option value={SettingsQueryModifier.Normal}>Normal</option>
					<option value={SettingsQueryModifier.Extra}>Extra</option>
					<option value={SettingsQueryModifier.Absurd}>Absurd</option>
				</select>

				<div class="pl-2 mt-4 mb-1 text-lg">Skateboards:</div>
				<select
					bind:value={selectedSkateboardFreq}
					id="skateboardFreqSelect"
					class="select select-bordered w-full max-w-xs"
				>
					<option value={SettingsQueryModifier.Normal}>Normal</option>
					<option value={SettingsQueryModifier.Extra}>Extra</option>
					<option value={SettingsQueryModifier.Absurd}>Absurd</option>
				</select>

				<div class="pl-2 mt-4 mb-1 text-lg">Unicycles:</div>
				<select
					bind:value={selectedUnicycleFreq}
					id="unicycleFreqSelect"
					class="select select-bordered w-full max-w-xs"
				>
					<option value={SettingsQueryModifier.Normal}>Normal</option>
					<option value={SettingsQueryModifier.Extra}>Extra</option>
					<option value={SettingsQueryModifier.Absurd}>Absurd</option>
				</select>
			</div>
			<div class="flex justify-end bottom-0 border-t-2 border-neutral mt-10 pt-4">
				<button class="btn btn-ghost" on:click={saveSettings}>Save</button>
				<button class="btn btn-ghost" on:click={onClose}>Cancel</button>
			</div>
		</div>
	</div>
</div>
