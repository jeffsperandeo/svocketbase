
<script lang="ts">
    import { pb } from '$lib/pocketbase';
    import { currentUser } from '$lib/pocketbase';
    import { onMount } from 'svelte';
    
    let profile = null;
    let sparringSessions = [];
    let trainingStats = {
        totalHours: 0,
        weeklyHours: 0,
        submissions: 0,
        techniques: 0
    };
    let loading = true;
    let error = '';

    async function loadDashboardData() {
        try {
            // Load user profile
            const profileData = await pb.collection('profile').getFirstListItem(
                `user_id="${$currentUser.id}"`
            );
            profile = profileData;

            // Load recent sparring sessions
            const recentSparring = await pb.collection('sparring_sessions').getList(1, 5, {
                filter: `user_id="${$currentUser.id}"`,
                sort: '-date',
                expand: 'partner_id,technique_id,gym_id'
            });
            sparringSessions = recentSparring.items;

            // Calculate stats
            trainingStats.totalHours = profile.total_training_hours || 0;
            
            // Get this week's sparring hours
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            const weeklySpars = await pb.collection('sparring_sessions').getList(1, 50, {
                filter: `user_id="${$currentUser.id}" && date >= "${oneWeekAgo.toISOString()}"`,
            });
            trainingStats.weeklyHours = weeklySpars.items.reduce((acc, curr) => acc + (curr.duration || 0), 0) / 60;
            
            // Count unique submissions/techniques
            const uniqueTechniques = new Set(sparringSessions.map(s => s.techniques_used)).size;
            trainingStats.techniques = uniqueTechniques;

        } catch (err) {
            console.error('Error loading dashboard data:', err);
            error = 'Failed to load dashboard data';
        } finally {
            loading = false;
        }
    }

    onMount(() => {
        if ($currentUser) {
            loadDashboardData();
        }
    });

    function getBeltColor(belt: string): string {
        const colors = {
            'White': 'bg-gray-100',
            'Blue': 'bg-blue-500',
            'Purple': 'bg-purple-500',
            'Brown': 'bg-yellow-800',
            'Black': 'bg-black'
        };
        return colors[belt] || 'bg-gray-100';
    }
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Welcome back, {$currentUser?.name}</h1>
        {#if profile}
            <div class="mt-2 flex items-center space-x-4">
                <div class={`h-3 w-16 rounded ${getBeltColor(profile.belt_rank)}`}></div>
                <span class="text-gray-600">{profile.belt_rank || 'No Belt'} Belt</span>
                {#if profile.last_promotion_date}
                    <span class="text-gray-500">•</span>
                    <span class="text-gray-600">
                        Promoted {new Date(profile.last_promotion_date).toLocaleDateString()}
                    </span>
                {/if}
            </div>
        {/if}
    </div>

    {#if loading}
        <div class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
    {:else if error}
        <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
        </div>
    {:else}
        <!-- Training Stats -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="bg-white rounded-lg shadow p-6">
                <div class="text-sm font-medium text-gray-500 mb-1">Total Mat Time</div>
                <div class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">{trainingStats.totalHours}</div>
                    <div class="ml-2 text-sm text-gray-500">hours</div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
                <div class="text-sm font-medium text-gray-500 mb-1">This Week</div>
                <div class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">
                        {trainingStats.weeklyHours.toFixed(1)}
                    </div>
                    <div class="ml-2 text-sm text-gray-500">hours</div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
                <div class="text-sm font-medium text-gray-500 mb-1">Techniques Used</div>
                <div class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">{trainingStats.techniques}</div>
                    <div class="ml-2 text-sm text-gray-500">unique</div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
                <div class="text-sm font-medium text-gray-500 mb-1">Training Since</div>
                <div class="text-2xl font-semibold text-gray-900">
                    {profile?.training_start_date ? new Date(profile.training_start_date).toLocaleDateString() : 'Not set'}
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Recent Sparring -->
            <div class="bg-white rounded-lg shadow">
                <div class="px-6 py-5 border-b border-gray-200">
                    <h3 class="text-lg font-medium text-gray-900">Recent Sparring Sessions</h3>
                </div>
                <div class="p-6">
                    {#if sparringSessions.length > 0}
                        <div class="space-y-6">
                            {#each sparringSessions as session}
                                <div class="flex items-start justify-between pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                                    <div>
                                        <div class="font-medium text-gray-900">
                                            {#if session.expand?.partner_id}
                                                vs {session.expand.partner_id.name}
                                            {:else}
                                                Sparring Session
                                            {/if}
                                        </div>
                                        <div class="text-sm text-gray-500 mt-1">
                                            {#if session.expand?.gym_id}
                                                at {session.expand.gym_id.name} •
                                            {/if}
                                            {new Date(session.date).toLocaleDateString()}
                                        </div>
                                        {#if session.techniques_used}
                                            <div class="mt-2 text-sm">
                                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {session.techniques_used}
                                                </span>
                                            </div>
                                        {/if}
                                    </div>
                                    <div class="text-sm text-gray-500">
                                        {session.duration} min
                                    </div>
                                </div>
                            {/each}
                        </div>
                    {:else}
                        <p class="text-gray-500 text-center py-4">No recent sparring sessions</p>
                    {/if}
                </div>
            </div>

            <!-- Training Goals & Stats -->
            <div class="bg-white rounded-lg shadow">
                <div class="px-6 py-5 border-b border-gray-200">
                    <h3 class="text-lg font-medium text-gray-900">Training Focus</h3>
                </div>
                <div class="p-6">
                    <div class="space-y-6">
                        {#if profile?.guard_style}
                            <div>
                                <div class="text-sm font-medium text-gray-500 mb-1">Preferred Guard</div>
                                <div class="text-gray-900">{profile.guard_style}</div>
                            </div>
                        {/if}
                        
                        {#if profile?.submission_specialties}
                            <div>
                                <div class="text-sm font-medium text-gray-500 mb-1">Submission Specialties</div>
                                <div class="text-gray-900">{profile.submission_specialties}</div>
                            </div>
                        {/if}

                        {#if profile?.goals}
                            <div>
                                <div class="text-sm font-medium text-gray-500 mb-1">Current Goals</div>
                                <div class="text-gray-900">{profile.goals}</div>
                            </div>
                        {/if}

                        {#if profile?.notable_achievements}
                            <div>
                                <div class="text-sm font-medium text-gray-500 mb-1">Notable Achievements</div>
                                <div class="text-gray-900">{profile.notable_achievements}</div>
                            </div>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>
```