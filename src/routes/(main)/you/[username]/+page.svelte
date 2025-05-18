<script lang="ts">
	import { page } from '$app/stores';
	import BorderedBox from '$lib/components/BorderedBox.svelte';
	import Button from '$lib/components/Button.svelte';
	import ProfilePhotoUpload from '$lib/components/ProfilePhotoUpload.svelte';
	import ThoughtButton from '$lib/components/ThoughtButton.svelte';
	import type { PageData } from './$types';

	let { data, form } = $props();

	let thoughts = $derived(form?.thoughts);
	let isOwnProfile = $derived(!!data.props?.own);
	let openThoughts = $state(false);
	$inspect('thoughts', thoughts);
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

{#if isOwnProfile}
	<BorderedBox class="max-w-lg xs:w-9/12">
		<div class="flex flex-col items-center w-full">
			<div>
				<h2 class="text-2xl">
					{thoughts ? 'These people have thought about you' : 'Who has thought about you?'}
				</h2>
				{#if !thoughts}
					<div>
						<form method="post" action={'?/getThoughts'}>
							<Button type="submit" class="w-48">
								{openThoughts ? 'Hide Thoughts' : 'View Thoughts'}
							</Button>
						</form>
					</div>
				{/if}
				<div class="flex flex-col">
					{#if thoughts}
						<ul class="flex flex-col">
							{#each thoughts as thought}
								<li class="flex flex-col">
									<h3 class="text-xl font-bold">{thought?.person?.username}</h3>
									<p>{thought?.person?.given_name}</p>
									<p>{thought?.person?.preferred_name}</p>
								</li>
							{/each}
						</ul>
					{/if}
				</div>
			</div>
		</div>
	</BorderedBox>
{/if}
