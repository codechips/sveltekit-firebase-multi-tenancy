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
  import { auth } from '$lib/auth';
  import { getJobById } from '$lib/store';
  import { onMount } from 'svelte';

  export let id: string | undefined = undefined;
  let job = null;

  onMount(() => {
    auth.subscribe(async (state) => {
      if (state.user) {
        job = await getJobById(state.company.id, id);
      }
    });
  });
</script>

<div class="space-y-4">
  {#if job}
    <h2>{job.title}</h2>
    <pre>{JSON.stringify(job, null, 2)}</pre>
  {:else}
    <p>No job found</p>
  {/if}

  <div><a href="/">Home</a></div>
</div>
