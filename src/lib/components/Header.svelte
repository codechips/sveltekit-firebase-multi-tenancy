<script lang="ts">
  import Auth from '$lib/components/Auth.svelte';
  export let name: string | undefined = undefined;
</script>

<header class="bg-gray-900 text-white py-8">
  <div class="flex justify-between max-w-4xl mx-auto align-middle">
    <h1 class="font-extrabold text-2xl">{name || 'Acme, Inc'}</h1>
    <Auth />
  </div>
</header>
