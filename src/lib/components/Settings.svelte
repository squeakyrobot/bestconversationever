<script lang="ts">
	import { SettingsQueryModifier, type UserSettings } from '$lib/user';
	import { onMount } from 'svelte';
	import { updateUserSettings } from '$lib/settings';
	import { sessionUser } from '$lib/stores/session-user';

	export let panel: string;

	// TODO: cleanup all this ugly settings stuff
	let selectedGoatFreq = SettingsQueryModifier.Normal;
	let selectedRobotFreq = SettingsQueryModifier.Normal;
	let selectedSkateboardFreq = SettingsQueryModifier.Normal;
	let selectedUnicycleFreq = SettingsQueryModifier.Normal;
	let settings = $sessionUser.settings;

	onMount(() => {
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

		const settingsPanel = document.querySelector(`#${panel}`);
		settingsPanel?.removeAttribute('open');
	};
</script>

<div class="card-body">
	<h3 class="card-title top-0 pb-1">Settings</h3>
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
	<div class="flex justify-end bottom-0 border-t-2 border-slate-500 mt-2">
		<button class="btn btn-ghost mt-2" on:click={saveSettings}>Save</button>
	</div>
</div>
