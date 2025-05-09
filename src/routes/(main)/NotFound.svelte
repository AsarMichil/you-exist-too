<script lang="ts">
	import Bear404 from '$lib/icons/Bear404.svelte';
</script>

<svelte:head>
	<title>404 | You Exist</title>
</svelte:head>

<div class="flex flex-col md:flex-row items-center grow my-4">
	<div class="w-full md:w-2/5">
		<h1 class="text-2xl font-mont">404: Page Not Found</h1>
		<p class="text-sm text-slate-600 dark:text-slate-300 mb-4">
			Oops! The page you're looking for doesn't exist. And he's a bear, so he doesn't know what to
			do.
		</p>
		<a
			href="/"
			class="underline text-slate-600 dark:text-slate-300 hocus:text-forestgreen-500 dark:hocus:text-forestgreen-500"
			>Go back to the home page</a
		>
	</div>
	<div class="w-full max-w-96 md:max-w-none md:w-3/5">
		<Bear404 />
	</div>
</div>
