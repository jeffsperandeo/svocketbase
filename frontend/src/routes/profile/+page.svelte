<!-- src/routes/profile/+page.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { pb } from '$lib/pocketbase';

    onMount(() => {
        console.log('Profile component mounted');
        console.log('Auth state:', pb.authStore.isValid);
    });
</script>

<div class="max-w-4xl mx-auto py-8 px-4">
    <h1 class="text-3xl font-bold mb-8">Profile Page</h1>
    <p>If you see this, authentication is working!</p>
</div>