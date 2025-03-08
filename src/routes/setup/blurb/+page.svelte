<script lang="ts">
	import BorderedBox from '$lib/components/BorderedBox.svelte';
	import Button from '$lib/components/Button.svelte';
	import Textarea from '$lib/components/Textarea.svelte';
	import { superForm } from 'sveltekit-superforms';

	let { data } = $props();
	const { form, errors, enhance } = superForm(data.form);
</script>

<main class="flex flex-col w-full h-full justify-center items-center p-4 space-y-4">
	<h1 class="font-mont text-2xl">Tell us about yourself</h1>

	<BorderedBox>
		<form method="POST" use:enhance class="space-y-4">
			<div>
				<Textarea
					name="blurb"
					id="blurb"
					label="Write a short bio"
					rows={4}
					bind:value={$form.blurb}
				/>
				{#if $errors?.blurb}
					<p class="text-sm text-red-500">
						{$errors.blurb}
					</p>
				{/if}
			</div>
			<div class="text-sm text-gray-500">
				This will be displayed on your profile. You can share your interests, hobbies, or anything
				else you'd like others to know about you.
			</div>
			<Button type="submit">Finish Setup</Button>
		</form>
	</BorderedBox>
</main>
