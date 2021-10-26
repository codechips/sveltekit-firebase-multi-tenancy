<script context="module">
  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load({ page }) {
    return {
      props: {
        id: page.params.id
      }
    };
  }
</script>

<script lang="ts">
  import type { Job } from '$lib/types';
  import { onMount } from 'svelte';

  export let id: string | undefined = undefined;

  let jobsPromise: Promise<Job[]> | null = null;

  onMount(async () => {
    const store = await import('$lib/store');
    const { getJobs } = store;
    jobsPromise = getJobs(id);
  });
</script>

<div class="space-y-4">
  <h2>Jobs for company with ID: {id}</h2>

  {#if jobsPromise}
    {#await jobsPromise}
      <p>Loading ...</p>
    {:then jobs}
      <table class="min-w-full table-auto">
        <thead>
          <tr>
            <th>Name</th>
            <th>Created By</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {#each jobs as job (job.id)}
            <tr>
              <td>{job.title}</td>
              <td>{job.createdBy}</td>
              <td>{job.createdAt.toDate().toJSON()}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    {:catch error}
      <p>You don't have permissions to read this data</p>
    {/await}
  {/if}

  <div><a href="/">Home</a></div>
</div>
