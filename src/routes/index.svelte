<script lang="ts">
  import { onMount } from 'svelte';
  import { auth } from '$lib/auth';
  import type { Job } from '$lib/types';

  let jobs: Job[] = [];

  let authState = undefined;
  let showForm = false;
  let values = { title: '' };
  // this is ugly because we need to import store dynamically
  let store = null;

  const submit = async () => {
    const payload = { ...values, createdBy: authState.user?.id };
    // this needs to be wrapped in try/catch
    store.createJob(authState.user?.companyId, payload);
    reset();
    jobs = await store.getJobs(authState.user?.companyId);
  };

  const reset = () => {
    values = { title: '' };
    showForm = false;
  };

  // need to wrap in the onmount hook because Firestore works in the browser only
  onMount(() => {
    auth.subscribe(async (state) => {
      // dynamic imports are needed to avoid SvelteKit from throwing errors on the server
      store = await import('$lib/store');
      authState = state;
      jobs = await store.getJobs(state.user.companyId);
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
    <div class="flex space-x-2">
      <a href="/{$auth.company.id}">View all jobs</a>
      <button class="link" on:click={() => (showForm = true)}>Create new job</button>
    </div>
  {/if}

  {#if showForm}
    <div class="w-2/3 py-4 px-8 bg-gray-200">
      <form on:submit|preventDefault={submit}>
        <div>
          <label for="title" class="text-xs font-medium uppercase">Title</label>
          <input
            type="text"
            name="title"
            bind:value={values.title}
            placeholder="Please enter a job title"
          />
        </div>
        <div class="mt-4">
          <button class="submit">Create</button>
          <button type="button" on:click={reset}>Cancel</button>
        </div>
      </form>
    </div>
  {/if}
</div>
