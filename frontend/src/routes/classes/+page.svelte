<script lang="ts">
    import { goto } from '$app/navigation';
    import type { PageData } from './$types';

    export let data: PageData;

    function formatDateTime(dateStr: string): string {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        }).format(date);
    }

    function viewClass(id: string) {
        goto(`/classes/${id}`);
    }

    $: console.log('Page data:', data);
</script>

<div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">BJJ Classes</h1>
        <p class="mt-2 text-sm text-gray-600">View and manage your training schedule</p>
    </div>

    {#if data.error}
        <div class="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {data.error}
        </div>
    {/if}

    <!-- All Upcoming Classes -->
    <section>
        <h2 class="text-2xl font-semibold text-gray-900 mb-6">Upcoming Classes</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each data.upcomingClasses as cls}
                <div 
                    class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
                    on:click={() => viewClass(cls.id)}
                >
                    <div class="flex justify-between items-start">
                        <div>
                            <h4 class="text-lg font-medium text-gray-900">{cls.name}</h4>
                            <p class="text-sm text-gray-500">
                                {formatDateTime(cls.schedule)}
                            </p>
                        </div>
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {cls.skill_level || 'All Levels'}
                        </span>
                    </div>

                    {#if cls.description}
                        <p class="mt-2 text-sm text-gray-600 line-clamp-2">{cls.description}</p>
                    {/if}

                    <div class="mt-4 text-sm text-gray-500">
                        <span>{cls.duration} mins</span>
                        <div class="flex items-center space-x-2 mt-1">
                            {#if cls.expand?.instructor_id}
                                <span>with {cls.expand.instructor_id.name}</span>
                            {/if}
                            {#if cls.expand?.gym_id}
                                <span>at {cls.expand.gym_id.name}</span>
                            {/if}
                        </div>
                    </div>
                </div>
            {/each}
        </div>

        {#if data.upcomingClasses.length === 0}
            <div class="text-center py-12 bg-gray-50 rounded-lg">
                <p class="text-gray-500">No upcoming classes scheduled</p>
            </div>
        {/if}
    </section>
</div>