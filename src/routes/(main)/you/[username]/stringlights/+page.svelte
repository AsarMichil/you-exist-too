<script lang="ts">
	import { page } from '$app/stores';
	import BorderedBox from '$lib/components/BorderedBox.svelte';
	import Button from '$lib/components/Button.svelte';
	import ThoughtButton from '$lib/components/ThoughtButton.svelte';
	import StringLightsContainer from '$lib/components/StringLightsContainer.svelte';
	import { goto } from '$app/navigation';

	let { data, form } = $props();

	let thoughts = $derived(form?.thoughts);
	let isOwnProfile = $derived(!!data.props?.own);
	
	function goToCandles() {
		goto(`/you/${data.props?.person?.username}`);
	}
	
	function goToLightbulbs() {
		goto(`/you/${data.props?.person?.username}/lightbulbs`);
	}
</script>

<svelte:head>
	<title
		>{data.props?.person?.preferred_name ?? data.props?.person?.given_name} | String Lights | You Exist Too</title
	>
</svelte:head>

<div class="flex flex-col items-center">
	<!-- Add the ThoughtButton component -->
	<ThoughtButton
		username={data.props?.person?.username ?? ''}
		thoughtCount={data.props?.thoughtCount ?? 0}
	/>
</div>

{#if isOwnProfile}
	<BorderedBox class="max-w-3xl mx-auto mb-8">
		<div class="flex flex-col items-center w-full">
			<div class="w-full">
				<h2 class="text-2xl mb-4 text-center">
					{thoughts ? 'These people have thought about you (Patio Lights Edition)' : 'Who has thought about you?'}
				</h2>

				<div class="thoughts-visualization">
					{#if !thoughts}
						<div class="text-center mb-6">
							<p class="text-slate-600 dark:text-slate-300 mb-4">
								View who has been thinking about you, represented as warm patio string lights. Each light
								represents a thought, and you can hover over them to see more details.
							</p>
							<form method="post" action={'?/getThoughts'}>
								<Button type="submit" class="w-48">
									{form?.openStringLights ? 'Hide Thoughts' : 'View Thoughts'}
								</Button>
							</form>
						</div>
					{:else}
						<div class="mb-4 flex justify-between">
							<button 
								class="text-sm text-slate-600 dark:text-slate-300 hover:text-forestgreen-600 dark:hover:text-forestgreen-400 transition-colors"
								onclick={goToCandles}
							>
								← Switch to Candles View
							</button>
							<button 
								class="text-sm text-slate-600 dark:text-slate-300 hover:text-forestgreen-600 dark:hover:text-forestgreen-400 transition-colors"
								onclick={goToLightbulbs}
							>
								Try Lightbulbs View →
							</button>
						</div>
						<StringLightsContainer thoughts={thoughts || []} />
					{/if}
				</div>
			</div>
		</div>
	</BorderedBox>
{/if} 