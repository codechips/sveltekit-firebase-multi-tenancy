<script lang="ts">
	import { onMount } from 'svelte';
	import { auth } from '$lib/auth';
	import type { Job } from '$lib/types';

	let jobs: Job[] = [];

	// need to wrap in the onmount hook because Firestore works in the browser only
	onMount(() => {
		auth.subscribe(async (state) => {
			// dynamic imports are needed to avoid SvelteKit from throwing errors on the server
			const store = await import('$lib/store');
			const { getJobs } = store;
			jobs = await getJobs(state.user.companyId);
		});
	});
</script>

<div class="space-y-4">
	<h2>Jobs for {$auth.company.name}</h2>

	{#if !jobs.length}
		<p>No jobs</p>
	{:else}
		<ul>
			{#each jobs as job (job.id)}
				<li><a href="/job/{job.id}">{job.title}</a></li>
			{/each}
		</ul>
		<div>
			<a href="/{$auth.company.id}">View all jobs</a>
		</div>
	{/if}
</div>
