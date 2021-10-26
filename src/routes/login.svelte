<script lang="ts">
  import { auth } from '$lib/auth';
  import { goto } from '$app/navigation';

  let values = {
    email: '',
    password: ''
  };

  const login = async () => {
    try {
      await auth.login(values.email, values.password);
      goto('/');
    } catch (err) {
      console.log(err);
    }
  };
</script>

<h2>Login</h2>

<div class="max-w-2xl">
  <form on:submit|preventDefault={login}>
    <div>
      <label>
        <span>Email</span>
        <input type="email" bind:value={values.email} />
      </label>

      <label>
        <span>Password</span>
        <input type="password" bind:value={values.password} />
      </label>
    </div>
    <div class="mt-4">
      <button>Login</button>
    </div>
  </form>
</div>
