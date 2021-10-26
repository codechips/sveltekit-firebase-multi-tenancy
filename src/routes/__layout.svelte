<script lang="ts">
  import '../app.css';

  import Header from '$lib/components/Header.svelte';
  import Login from '$lib/components/Login.svelte';
  import { auth } from '$lib/auth';
</script>

<main>
  <Header name={$auth.company?.name} />
  <div class="max-w-4xl mx-auto py-8">
    {#if $auth.loading}
      <div class="text-gray-600">Loading ...</div>
    {:else if $auth.user}
      <slot />
    {:else}
      <Login />
    {/if}
  </div>
</main>
