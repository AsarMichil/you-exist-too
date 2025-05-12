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
			photosLink="https://share.icloud.com/photos/06ehVX-OAEdFIQBVUCILAGC7A"
		/>
		<PhotoBox
			header="Jacob's"
			description="Photos from Jacob's Halloween party."
			photosLink="https://share.icloud.com/photos/0b3id4hxB76d5lztw-dM0xxdg"
		/>
		<PhotoBox
			header="Rose's"
			description="Photos from Rose's Halloween party."
			photosLink="https://share.icloud.com/photos/012wcjO3Z_FoCtxQjX5AETu0A"
		/>
		<PhotoBox
			header="Gen's"
			description="Photos from Gen's Halloween party."
			photosLink="https://share.icloud.com/photos/033egMY2J8mxMyKXR099KfpcA"
		/>
		<PhotoBox
			header="Paris, Lille, Brussels and Amsterdam"
			description="Photos from part of my Europe trip."
			photosLink="https://share.icloud.com/photos/006RoD4POLuXvHqOerj87t4Ww"
		/>
	</article>
</main>
