<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import FormError from '$lib/components/FormError.svelte';
	import type { ActionData } from './$types';
	import StyledInput from '../../lib/components/StyledInput.svelte';
	import I_Info from '../../lib/icons/I_Info.svelte';
	import IExCircle from '$lib/icons/I_ExCircle.svelte';
	import IExTriangle from '$lib/icons/I_ExTriangle.svelte';
	import StyledTextarea from '$lib/components/StyledTextarea.svelte';
	import CountrySelect from './CountrySelect.svelte';
	let { form }: { form: ActionData } = $props();
</script>

<article class="flex items-center justify-center w-full">
	<section class="p-8 space-y-2 w-9/12 max-w-xl">
		<h1 class="text-2xl text-center">Create your profile</h1>
		<p class="text-lg">
			Literally the main point of this app is to create a profile. So, let's get started.
		</p>
		<div>
			<form method="POST" class="flex flex-col space-y-2 max-w-lg">
				<div class="flex gap-4 w-full flex-col md:flex-row">
					<StyledInput type="text" label="Given Name" name="given_name" labelClass="w-full" />
					<StyledInput type="text" label="Family Name" name="family_name" labelClass="w-full" />
				</div>
				<StyledInput type="text" label="Preferred Name" class="w-full" name="preferred_name" />
				
				<StyledTextarea label="Blurb" class="" name="blurb" />
				<CountrySelect class="" name="country" />
				<FormError class="min-h-8" error={form?.error} prefixWith="Error: ">
					{#snippet icon()}
						<IExCircle class="w-6 h-6" />
					{/snippet}
				</FormError>
				<Button>Submit</Button>
			</form>
		</div>
	</section>
</article>
