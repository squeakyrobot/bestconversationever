<script lang="ts">
	import PolicyPage from '$lib/components/PolicyPage.svelte';
	import type { PageData } from '../$types';

	export let data: PageData;
</script>

<PolicyPage policy={data.policy} />
