<script lang="ts">
	import ThoughtButton from '$lib/components/ThoughtButton.svelte';

	let { data } = $props();
	const { person } = data;
</script>

<svelte:head>
	<title>Thinking about {person.displayName} | You Exist Too</title>
</svelte:head>

<div class="flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
	<div class="text-center mb-6">
		<h1 class="text-3xl font-gar mb-2">Thinking about {person.displayName}</h1>
		<p class="text-slate-600 dark:text-slate-300">Let them know they're on your mind</p>
	</div>

	<div class="w-full max-w-md">
		<ThoughtButton username={person.username} thoughtCount={person.thoughtCount} />
	</div>
</div>
