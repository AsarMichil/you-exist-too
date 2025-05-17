<script lang="ts">
	import BorderedBox from '$lib/components/BorderedBox.svelte';
	import Button from '$lib/components/Button.svelte';
	import CountrySelect from '$lib/components/CountrySelect.svelte';
	import SetupNavigation from '$lib/components/SetupNavigation.svelte';
	import ExpandableContent from '$lib/components/clean-form/ExpandableContent.svelte';
	import { setForwardRoute, setTransitionDirection } from '$lib/stores/setup.svelte.js';
	import { superForm } from 'sveltekit-superforms';

	let { data } = $props();
	const { form, errors, enhance } = superForm(data.form);

	// Define routes for navigation
	const backwardRoute = 'name';
	const forwardRoute = 'blurb';
</script>

<SetupNavigation {backwardRoute} {forwardRoute} canGoBackward={true} canGoForward={!!$form.country}>
	<section class="flex flex-col w-full h-full justify-center items-center p-4">
		<BorderedBox>
			<h1 class="font-mont text-lg font-semibold w-full">Where are you from?</h1>

			<form
				method="POST"
				use:enhance
				class="space-y-4"
				onsubmit={() => {
					setTransitionDirection('forward');
				}}
			>
				<div>
					<div class="flex gap-2 items-end">
						<div class="text-nowrap h-full">I'm from:</div>
						<CountrySelect
							name="country"
							bottomBorderOnly
							massive
							class="grow"
							bind:value={$form.country}
							error={$errors?.country}
						/>
					</div>
					{#if $errors?.country}
						<p class="text-sm text-red-500">{$errors.country}</p>
					{/if}
					{#if $form.country === 'CA'}
						<ExpandableContent class="h-4">
							<p class="text-sm">Canada eh? Love ya!</p>
						</ExpandableContent>
					{/if}
				</div>
				<Button type="submit">Next</Button>
			</form>
		</BorderedBox>
	</section>
</SetupNavigation>
