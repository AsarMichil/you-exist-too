<script lang="ts">
	import BorderedBox from '$lib/components/BorderedBox.svelte';
	import Button from '$lib/components/Button.svelte';
	import Textarea from '$lib/components/Textarea.svelte';
	import SetupNavigation from '$lib/components/SetupNavigation.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { setTransitionDirection } from '$lib/stores/setup.svelte.js';

	let { data } = $props();
	const { form, errors, enhance } = superForm(data.form);
	console.log('form', $form, $errors);
	
	// Define routes for navigation
	const backwardRoute = 'origin';
	const forwardRoute = 'profile-photo';
</script>

<SetupNavigation
	backwardRoute={backwardRoute}
	forwardRoute={forwardRoute}
	canGoBackward={true}
	canGoForward={!!$form.blurb}
	progress={80}
>
	<section class="flex flex-col w-full h-full justify-center items-center p-4 space-y-4">
		<BorderedBox>
			<h1 class="font-mont text-lg font-semibold">Write a short bio!</h1>

			<form
				method="POST"
				use:enhance
				class="space-y-4"
				onsubmit={() => {
					setTransitionDirection('forward');
				}}
			>
				<div>
					<Textarea name="blurb" id="blurb" rows={4} bind:value={$form.blurb} />
					{#if $errors?.blurb}
						<p class="text-sm text-red-500">
							{$errors.blurb}
						</p>
					{/if}
				</div>
				<div class="text-sm">
					*This will be displayed on your profile. You can share your interests, hobbies, or anything
					else you'd like others to know about you.
				</div>
				<Button type="submit">Last Step</Button>
			</form>
		</BorderedBox>
	</section>
</SetupNavigation>
