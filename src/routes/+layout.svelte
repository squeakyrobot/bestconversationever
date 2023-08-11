<script lang="ts">
	import '../app.css';
</script>

<div class="navbar bg-base-100">
	<div class="flex-none">
		<div class="dropdown">
			<label for="menu" tabindex="0" class="btn btn-ghost btn-circle">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h16M4 18h7"
					/></svg
				>
			</label>
			<ul
				tabindex="0"
				class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
			>
				<li><a href="/">Homepage</a></li>
				<li><a href="/rant">Rant</a></li>
				<li><a href="/about">About</a></li>
			</ul>
		</div>
	</div>
	<div class="flex-1">
		<a href="/" class="btn btn-ghost normal-case text-xl">No One Gives a Shit</a>
	</div>
	<div class="flex-none">
		<!-- Add right aligned stuff here-->
	</div>
</div>

<div class="ml-10">
	<slot />
</div>
