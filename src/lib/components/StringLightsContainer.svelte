<script lang="ts">
	import Button from './Button.svelte';
	import StringLight from './StringLight.svelte';
	import EmptyState from './EmptyState.svelte';
	import { ArrowLeft, ArrowRight, SortAsc, SortDesc } from '@lucide/svelte';

	// Define thought type
	interface Person {
		username: string;
		given_name: string | null;
		preferred_name?: string | null;
		id?: string;
	}

	interface Thought {
		id: string | number;
		person?: Person | null;
		created_at: string | Date;
		about?: string;
		thinker?: string | null;
	}

	// Props
	let { thoughts } = $props<{ thoughts: Thought[] }>();

	// State
	let currentPage = $state(1);
	let sortOrder = $state('latest'); // 'latest' or 'oldest'
	let itemsPerPage = $state(20);
	let prevSortOrder = $state('latest');

	// Generate random delay for light animations
	function getRandomDelay() {
		return `${(Math.random() * 2).toFixed(2)}s`;
	}

	// Update prevSortOrder when sortOrder changes
	$effect(() => {
		// Reset to first page when changing sort order
		if (sortOrder !== prevSortOrder) {
			currentPage = 1;
			prevSortOrder = sortOrder;
		}
	});

	// Compute sorted thoughts - pure function with no state mutations
	function getSortedThoughts(thoughtsToSort: Thought[], order: string) {
		if (order === 'latest') {
			return [...thoughtsToSort].sort(
				(a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
			);
		} else {
			return [...thoughtsToSort].sort(
				(a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
			);
		}
	}

	// Get paginated thoughts based on current settings
	function getPaginatedThoughts() {
		const sorted = getSortedThoughts(thoughts, sortOrder);
		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = Math.min(startIndex + itemsPerPage, sorted.length);
		return sorted.slice(startIndex, endIndex);
	}

	// Calculate total pages
	$effect(() => {
		totalPages = Math.max(1, Math.ceil(thoughts.length / itemsPerPage));
	});

	let totalPages = $state(1);

	function nextPage() {
		if (currentPage < totalPages) {
			currentPage++;
		}
	}

	function prevPage() {
		if (currentPage > 1) {
			currentPage--;
		}
	}

	function toggleSortOrder() {
		sortOrder = sortOrder === 'latest' ? 'oldest' : 'latest';
	}
</script>

<div class="string-lights-container flex flex-col w-full">
	{#if thoughts.length > 0}
		<div
			class="controls flex justify-between items-center p-3 border-b border-slate-200 dark:border-slate-700 mb-6"
		>
			<div class="flex items-center">
				<button
					class="sort-button flex items-center gap-1 py-1 px-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm"
					onclick={toggleSortOrder}
					aria-label={sortOrder === 'latest' ? 'Sort by oldest first' : 'Sort by newest first'}
				>
					{#if sortOrder === 'latest'}
						<SortDesc class="w-4 h-4" />
						<span>Newest</span>
					{:else}
						<SortAsc class="w-4 h-4" />
						<span>Oldest</span>
					{/if}
				</button>
			</div>

			<div class="pagination flex items-center gap-2">
				<button
					class="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					onclick={prevPage}
					disabled={currentPage === 1}
					aria-label="Previous page"
				>
					<ArrowLeft class="w-4 h-4" />
				</button>

				<span class="text-sm">
					{currentPage} / {totalPages}
				</span>

				<button
					class="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					onclick={nextPage}
					disabled={currentPage === totalPages}
					aria-label="Next page"
				>
					<ArrowRight class="w-4 h-4" />
				</button>
			</div>
		</div>

		<div class="string-lights-display py-6 px-4">
			{#each Array(Math.ceil(getPaginatedThoughts().length / 8)) as _, rowIndex}
				<div 
					class="string-row flex flex-row justify-center mb-6" 
					style="transform: translateX({rowIndex % 2 === 0 ? '10px' : '-10px'});"
				>
					{#each getPaginatedThoughts().slice(rowIndex * 8, (rowIndex + 1) * 8) as thought, colIndex}
						<StringLight
							username={thought?.person?.username || ''}
							givenName={thought?.person?.given_name || ''}
							preferredName={thought?.person?.preferred_name || undefined}
							date={new Date(thought.created_at)}
							animationDelay={getRandomDelay()}
							position={colIndex}
							total={Math.min(8, getPaginatedThoughts().slice(rowIndex * 8, (rowIndex + 1) * 8).length)}
						/>
					{/each}
				</div>
			{/each}
		</div>

		{#if totalPages > 1}
			<div class="pagination-bottom flex justify-center items-center gap-4 mt-6">
				<button
					class="flex items-center gap-1 px-3 py-1 border border-slate-300 dark:border-slate-600 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
					onclick={prevPage}
					disabled={currentPage === 1}
					aria-label="Previous page"
				>
					<ArrowLeft class="w-4 h-4" />
					<span>Previous</span>
				</button>

				<span class="text-sm">
					Page {currentPage} of {totalPages}
				</span>

				<button
					class="flex items-center gap-1 px-3 py-1 border border-slate-300 dark:border-slate-600 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
					onclick={nextPage}
					disabled={currentPage === totalPages}
					aria-label="Next page"
				>
					<span>Next</span>
					<ArrowRight class="w-4 h-4" />
				</button>
			</div>
		{/if}
	{:else}
		<EmptyState
			title="No thoughts yet"
			message="No one has thought about you yet. Share your profile with friends to see thoughts appear here as beautiful string lights."
		/>
	{/if}
</div>

<style>
	.string-lights-display {
		background-color: rgba(0, 0, 0, 0.03);
		border-radius: 8px;
		min-height: 240px;
		background-image: linear-gradient(
			to bottom,
			rgba(255, 250, 240, 0.7),
			rgba(240, 240, 240, 0.4)
		);
		box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.05);
	}

	/* Dark mode adjustments */
	:global(.dark) .string-lights-display {
		background-color: rgba(0, 0, 0, 0.3);
		background-image: linear-gradient(
			to bottom,
			rgba(30, 30, 40, 0.7),
			rgba(20, 20, 30, 0.9)
		);
		box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.3);
	}
</style> 