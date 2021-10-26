<script lang="ts">
  import { auth } from '$lib/auth';
</script>

<div class="space-x-1">
  {#if $auth.loading}
    Checking auth status ...
  {:else if $auth.user}
    <button class="font-medium hover:underline" on:click={() => auth.logout()}>Logout</button>
    <span class="font-xs">{$auth.user.email}</span>
  {:else}
    <a href="/login" class="text-white hover:text-white hover:underline">Login</a>
  {/if}
</div>
