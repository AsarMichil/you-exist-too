<script lang="ts">
	const allowedLinks = import.meta.env.VITE_MAINTENANCE_ALLOWED_PATHS.split(',') as string[];
</script>

<main class="flex items-center justify-center h-[calc(100vh-53px)]">
	<div class="mb-10">
		<h1 class="text-2xl mb-2">Sorry! The rest of this site is still under construction :(</h1>
		<p>I'm trying to get it up as soon as I can between work, school, and living my life!</p>
		<p>Thanks for your patience!</p>
		<p class="pl-4">- <i>Asar</i></p>
		<div class="mt-4">
			<p>Here are links to the pages that currently work:</p>
			<div class="border border-slate-800 dark:border-white rounded-xl p-2 space-y-1">
				{#each allowedLinks as link}
					<a href={link} class="underline text-forestgreen-500 hocus:text-forestgreen-700">{link}</a
					>
				{/each}
			</div>
		</div>
	</div>
</main>
