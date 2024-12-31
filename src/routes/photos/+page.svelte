<script lang="ts">
	import PhotoBox from './photo-box.svelte';
</script>

<main class="space-y-2">
	<div class=" my-4">
		<h1 class="text-3xl font-mont mb-2">Photos</h1>
		<p>
			<i>Hey here's links to the photos I took at various times in my life. See if you're there!</i>
		</p>
		<p class="pl-4">- <i>Asar</i></p>
	</div>
	<article class="space-y-2 md:space-y-4">
		<h2 class="text-2xl">Halloween</h2>
		<PhotoBox
			header="Gill's"
			description="Photos from Gill's Halloween party."
			photosLink="https://share.icloud.com/photos/0c0HbUqla70-TCWXUVgPvmNsQ"
		/>
		<PhotoBox
			header="Jacob's"
			description="Photos from Jacob's Halloween party."
			photosLink="https://share.icloud.com/photos/07f98Qgtzcve52x1xRoOqXRHg"
		/>
		<PhotoBox
			header="Rose's"
			description="Photos from Rose's Halloween party."
			photosLink="https://share.icloud.com/photos/015ua9I8pC_YYwatwufgnrFpQ"
		/>
		<PhotoBox
			header="Gen's"
			description="Photos from Gen's Halloween party."
			photosLink="https://share.icloud.com/photos/076Ni976_XWrSf4Ov1sJpfanA"
		/>
		<PhotoBox
			header="Paris, Lille, Brussels and Amsterdam"
			description="Photos from part of my Europe trip."
			photosLink="https://share.icloud.com/photos/0915O6X5eRv7j-gmNA-b97UHg"
		/>
	</article>
</main>
