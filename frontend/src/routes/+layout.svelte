<script lang="ts">
    import { currentUser } from '$lib/pocketbase';
    import { page } from '$app/stores';
    import { fly } from 'svelte/transition';
    import { enhance } from '$app/forms';
    
    let isMenuOpen = false;
    
    const toggleMenu = () => isMenuOpen = !isMenuOpen;
    const closeMenu = () => isMenuOpen = false;
    
    // Navigation items
    const navItems = [
        { href: '/dashboard', label: 'Dashboard', protected: true },
        { href: '/training', label: 'Training Log', protected: true },
        { href: '/achievements', label: 'Achievements', protected: true },
        { href: '/profile', label: 'Profile', protected: true }
    ];
</script>

<div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <!-- Logo and main nav -->
                <div class="flex">
                    <div class="flex-shrink-0 flex items-center">
                        <a href="/" class="text-xl font-bold text-indigo-600">RolFlow</a>
                    </div>
                    
                    <!-- Desktop navigation -->
                    <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
                        {#if $currentUser}
                            {#each navItems.filter(item => !item.protected || $currentUser) as {href, label}}
                                <a
                                    {href}
                                    class="
                                        {$page.url.pathname === href ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}
                                        inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium
                                    "
                                >
                                    {label}
                                </a>
                            {/each}
                        {/if}
                    </div>
                </div>
                
                <!-- User menu -->
                <div class="flex items-center">
                    {#if $currentUser}
                        <div class="ml-3 relative">
                            <div class="flex items-center space-x-4">
                                <span class="text-sm text-gray-700">{$currentUser.name}</span>
                                <form action="/auth/logout" method="POST" use:enhance>
                                    <button 
                                        type="submit"
                                        class="bg-white px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none"
                                    >
                                        Logout
                                    </button>
                                </form>
                            </div>
                        </div>
                    {:else}
                        <div class="flex space-x-4">
                            <a 
                                href="/login"
                                class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Login
                            </a>
                            <a 
                                href="/register"
                                class="bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Sign Up
                            </a>
                        </div>
                    {/if}
                </div>
                
                <!-- Mobile menu button -->
                <div class="-mr-2 flex items-center sm:hidden">
                    <button
                        on:click={toggleMenu}
                        class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                        aria-expanded="false"
                    >
                        <span class="sr-only">Open main menu</span>
                        <svg
                            class="h-6 w-6"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <!-- Mobile menu -->
        {#if isMenuOpen}
            <div class="sm:hidden" transition:fly={{ y: -20, duration: 200 }}>
                <div class="pt-2 pb-3 space-y-1">
                    {#if $currentUser}
                        {#each navItems.filter(item => !item.protected || $currentUser) as {href, label}}
                            <a
                                {href}
                                class="
                                    {$page.url.pathname === href ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'}
                                    block pl-3 pr-4 py-2 border-l-4 text-base font-medium
                                "
                                on:click={closeMenu}
                            >
                                {label}
                            </a>
                        {/each}
                    {/if}
                </div>
            </div>
        {/if}
    </nav>

    <!-- Page content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <slot />
    </main>
    
    <!-- Footer -->
    <footer class="bg-white border-t mt-auto">
        <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <p class="text-center text-gray-500 text-sm">
                © 2024 RolFlow. Track your BJJ journey.
            </p>
        </div>
    </footer>
</div>