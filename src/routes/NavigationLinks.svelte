<script lang="ts">
	import { page } from '$app/stores';
</script>

<ul>
	<li><a href="/">Home</a></li>
	<li><a href="/rant">Rant</a></li>
	<li>{$page.data.time}</li>
</ul>
