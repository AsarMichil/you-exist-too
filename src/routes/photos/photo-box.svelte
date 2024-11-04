<script lang="ts">
	import ExternalLink from 'lucide-svelte/icons/external-link';
	let {
		header,
		description,
		photosLink,
		previewPhotos
	}: { header: string; description: string; photosLink: string; previewPhotos?: string[] } =
		$props();
</script>

<section class="rounded-xl border border-slate-800 dark:border-white p-2 md:p-4">
	<h2 class="text-xl">{header}</h2>
	<p class="">{description}</p>
	{#if previewPhotos}
		{#each previewPhotos as photo}
			<img src={photo} alt={`Photos from ${header}`} />
		{/each}
	{/if}
	<a
		class="underline text-forestgreen-500 hocus:text-forestgreen-700 flex items-center gap-1"
		href={photosLink}
		>See more photos <ExternalLink size={16} />
	</a>
</section>
