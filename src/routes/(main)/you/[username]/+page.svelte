<script lang="ts">
	import BorderedBox from '$lib/components/BorderedBox.svelte';
	import ThoughtButton from '$lib/components/ThoughtButton.svelte';
	import ThoughtsContainer from '$lib/components/ThoughtsContainer.svelte';

	let { data } = $props();

	let isOwnProfile = $derived(!!data.props?.own);
</script>

<svelte:head>
	<title
		>{data.props?.person?.preferred_name ?? data.props?.person?.given_name} | You Exist Too</title
	>
</svelte:head>

<div class="flex flex-col items-center">
	<!-- Add the ThoughtButton component -->
	<ThoughtButton
		username={data.props?.person?.username ?? ''}
		thoughtCount={data.props?.thoughtCount ?? 0}
	/>
</div>

{#if isOwnProfile && data.thoughts}
	<BorderedBox class="p-6 mb-5 max-w-lg mx-auto xs:w-9/12">
		<div class="flex flex-col items-center w-full">
			<div class="flex w-full">
				{#await data.thoughts}
					<div class="flex justify-center items-center h-full">Thinking...</div>
				{:then things}
					{#if things.error}
						<div class="flex justify-center items-center h-full">
							<p>Error loading thoughts</p>
						</div>
					{:else}
						<ThoughtsContainer thoughts={things.thoughts} />
					{/if}
				{:catch}
					<div class="flex justify-center items-center h-full">
						<p>Error loading thoughts</p>
					</div>
				{/await}
			</div>
		</div>
	</BorderedBox>
{/if}
