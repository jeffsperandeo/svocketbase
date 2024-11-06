<script lang="ts">
    import { currentUser, logout } from '$lib/pocketbase';
    import { page } from '$app/stores';
    import { fly } from 'svelte/transition';
    import { goto } from '$app/navigation';
    
    let isMenuOpen = false;
    
    const toggleMenu = () => isMenuOpen = !isMenuOpen;
    const closeMenu = () => isMenuOpen = false;
    
    const navItems = [
        { href: '/dashboard', label: 'Dashboard', icon: '📊' },
        { href: '/training', label: 'Training Log', icon: '📝' },
        { href: '/achievements', label: 'Achievements', icon: '🏆' },
        { href: '/profile', label: 'Profile', icon: '👤' }
    ];

    const handleNav = async (path: string) => {
        if ($currentUser) {
            await goto(path);
        }
    };

    const handleLogout = async () => {
        if (confirm('Are you sure you want to logout?')) {
            await logout();
        }
    };
</script>

<div class="min-h-screen bg-gray-50 flex flex-col">
    <nav class="bg-white shadow-lg border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <!-- Logo and main nav -->
                <div class="flex">
                    <div class="flex-shrink-0 flex items-center">
                        <button 
                            on:click={() => handleNav('/')}
                            class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-indigo-500 hover:to-purple-500 transition-all"
                        >
                            RolFlow
                        </button>
                    </div>
                    
                    <!-- Desktop navigation -->
                    <div class="hidden sm:ml-8 sm:flex sm:space-x-6">
                        {#if $currentUser}
                            {#each navItems as {href, label, icon}}
                                <button
                                    on:click={() => handleNav(href)}
                                    data-sveltekit-preload-data
                                    class="group flex items-center px-3 py-2 text-sm font-medium relative
                                        {$page.url.pathname === href ? 'text-indigo-600' : 'text-gray-700 hover:text-indigo-600'}"
                                >
                                    <span class="mr-2">{icon}</span>
                                    {label}
                                    {#if $page.url.pathname === href}
                                        <div class="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600"></div>
                                    {/if}
                                </button>
                            {/each}
                        {/if}
                    </div>
                </div>
                
                <!-- User menu -->
                <div class="flex items-center">
                    {#if $currentUser}
                        <div class="ml-3 relative">
                            <div class="flex items-center space-x-4">
                                <div class="flex items-center space-x-3">
                                    <div class="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                                        {$currentUser?.name?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <span class="text-sm font-medium text-gray-700">{$currentUser.name || 'User'}</span>
                                </div>
                                <button 
                                    on:click={handleLogout}
                                    class="bg-white px-4 py-2 rounded-md text-sm font-medium text-gray-700 
                                        hover:bg-gray-50 hover:text-gray-900 
                                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                                        border border-gray-300 transition-all"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    {:else}
                        <div class="flex space-x-4">
                            <button 
                                on:click={() => goto('/login')}
                                class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Login
                            </button>
                            <button 
                                on:click={() => goto('/register')}
                                class="px-4 py-2 rounded-md text-sm font-medium text-white
                                    bg-gradient-to-r from-indigo-600 to-purple-600
                                    hover:from-indigo-500 hover:to-purple-500
                                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                                    transition-all"
                            >
                                Sign Up
                            </button>
                        </div>
                    {/if}
                </div>
                
                <!-- Mobile menu button -->
                <div class="flex items-center sm:hidden">
                    <button
                        on:click={toggleMenu}
                        class="inline-flex items-center justify-center p-2 rounded-md text-gray-400
                            hover:text-gray-500 hover:bg-gray-100 
                            focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                        aria-expanded={isMenuOpen}
                    >
                        <span class="sr-only">Open main menu</span>
                        <svg
                            class="h-6 w-6 transition-transform duration-200"
                            class:rotate-180={isMenuOpen}
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
                <div class="pt-2 pb-3 space-y-1 bg-white shadow-lg">
                    {#if $currentUser}
                        {#each navItems as {href, label, icon}}
                            <button
                                on:click={() => {
                                    handleNav(href);
                                    closeMenu();
                                }}
                                class="flex items-center w-full px-4 py-2 text-base font-medium
                                    {$page.url.pathname === href ? 
                                        'bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600' : 
                                        'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'}"
                            >
                                <span class="mr-3">{icon}</span>
                                {label}
                            </button>
                        {/each}
                    {/if}
                </div>
            </div>
        {/if}
    </nav>

    <!-- Page content -->
    <main class="flex-grow">
        <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <slot />
        </div>
    </main>
    
    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200">
        <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center">
                <p class="text-gray-500 text-sm">
                    © 2024 RolFlow. Track your BJJ journey.
                </p>
                <div class="flex space-x-6">
                    <button on:click={() => goto('/privacy')} class="text-gray-500 hover:text-gray-700 text-sm">Privacy</button>
                    <button on:click={() => goto('/terms')} class="text-gray-500 hover:text-gray-700 text-sm">Terms</button>
                    <button on:click={() => goto('/contact')} class="text-gray-500 hover:text-gray-700 text-sm">Contact</button>
                </div>
            </div>
        </div>
    </footer>
</div>