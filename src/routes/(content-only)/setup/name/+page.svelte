<script lang="ts">
	import { goto, replaceState } from '$app/navigation';
	import BorderedBox from '$lib/components/BorderedBox.svelte';
	import Button from '$lib/components/Button.svelte';
	import ErrorTag from '$lib/components/ErrorTag.svelte';
	import Input from '$lib/components/Input.svelte';
	import SetupNavigation from '$lib/components/SetupNavigation.svelte';
	import ExpandableContent from '$lib/components/clean-form/ExpandableContent.svelte';
	import { setTransitionDirection } from '$lib/stores/setup.svelte.js';
	import { superForm } from 'sveltekit-superforms';

	let { data, form: formData } = $props();
	const { form, message, errors, enhance, constraints } = superForm(data.form);

	// Define routes for navigation
	const forwardRoute = 'origin';
</script>

<SetupNavigation {forwardRoute} canGoBackward={false} canGoForward={!!$form.preferred_name}>
	<section class="flex flex-col w-full h-full justify-center items-center p-4">
		<BorderedBox>
			<h1 class=" font-mont text-lg font-semibold w-full">What should people call you?</h1>

			<form
				method="POST"
				use:enhance
				class="space-y-4"
				onsubmit={() => {
					setTransitionDirection('forward');
				}}
			>
				<div>
					<div class="flex gap-2 items-baseline">
						<div class="w-fit text-nowrap">My preferred name is:</div>
						<Input
							bottomBorderOnly
							massive
							type="text"
							name="preferred_name"
							id="preferred_name"
							bind:value={$form.preferred_name}
							autocomplete="given-name"
							placeholder="Preferred Name"
						/>
					</div>
					{#if $errors.preferred_name}
						<p class="text-sm text-red-500">
							{$errors.preferred_name}
						</p>
					{/if}
				</div>
				{#if $form.preferred_name}
					<ExpandableContent class="h-28">
						<div>
							<div>But people might also use these to find me:</div>
							<Input
								bottomBorderOnly
								massive
								type="text"
								name="given_name"
								id="given_name"
								bind:value={$form.given_name}
								autocomplete="given-name"
								placeholder="First Name"
							/>
							<Input
								bottomBorderOnly
								massive
								type="text"
								name="family_name"
								id="family_name"
								bind:value={$form.family_name}
								autocomplete="family-name"
								placeholder="Family Name"
							/>
						</div>
					</ExpandableContent>
				{/if}
				<Button type="submit">Next</Button>
			</form>
		</BorderedBox>
	</section>
</SetupNavigation>
