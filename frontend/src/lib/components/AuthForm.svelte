<script lang="ts">
    import { pb } from '$lib/pocketbase';
    import { goto } from '$app/navigation';
    
    export let mode: 'login' | 'register' = 'login';
    
    let email = '';
    let password = '';
    let passwordConfirm = '';
    let name = '';
    let error = '';
    let loading = false;

    async function handleSubmit() {
        loading = true;
        error = '';
        
        try {
            if (mode === 'login') {
                await pb.collection('users').authWithPassword(email, password);
            } else {
                await pb.collection('users').create({
                    email,
                    password,
                    passwordConfirm,
                    name
                });
                // Auto login after registration
                await pb.collection('users').authWithPassword(email, password);
            }
            
            goto('/dashboard');
        } catch (err) {
            console.error('Auth error:', err);
            error = mode === 'login' 
                ? 'Invalid email or password' 
                : 'Registration failed. Please try again.';
        } finally {
            loading = false;
        }
    }
</script>

<div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
    <h1 class="text-2xl font-bold mb-6 text-center">
        {mode === 'login' ? 'Login' : 'Create Account'}
    </h1>
    
    {#if error}
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
        </div>
    {/if}
    
    <form on:submit|preventDefault={handleSubmit} class="space-y-4">
        {#if mode === 'register'}
            <div>
                <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
                <input
                    id="name"
                    type="text"
                    bind:value={name}
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
            </div>
        {/if}
        
        <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
                id="email"
                type="email"
                bind:value={email}
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
        </div>
        
        <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input
                id="password"
                type="password"
                bind:value={password}
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
        </div>
        
        {#if mode === 'register'}
            <div>
                <label for="passwordConfirm" class="block text-sm font-medium text-gray-700">
                    Confirm Password
                </label>
                <input
                    id="passwordConfirm"
                    type="password"
                    bind:value={passwordConfirm}
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
            </div>
        {/if}
        
        <button
            type="submit"
            disabled={loading}
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
            {#if loading}
                Loading...
            {:else}
                {mode === 'login' ? 'Sign In' : 'Create Account'}
            {/if}
        </button>
    </form>
    
    <div class="mt-4 text-center">
        {#if mode === 'login'}
            <a href="/register" class="text-sm text-blue-600 hover:text-blue-500">
                Need an account? Register
            </a>
        {:else}
            <a href="/login" class="text-sm text-blue-600 hover:text-blue-500">
                Already have an account? Login
            </a>
        {/if}
    </div>
</div>