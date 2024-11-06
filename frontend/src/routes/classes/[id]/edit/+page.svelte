<script lang="ts">
    import { enhance } from '$app/forms';
    import type { PageData } from './$types';

    export let data: PageData;
    
    // Correctly destructure class_item from data
    let { class_item, gyms } = data;
    let confirmingDelete = false;
</script>

<div class="container mx-auto px-4 py-8">
    <div class="bg-white rounded-lg shadow-lg p-6">
        <h1 class="text-3xl font-bold mb-6">Edit Class</h1>

        <form
            method="POST"
            action="?/update"
            use:enhance
            class="space-y-6"
        >
            <div>
                <label for="name" class="block text-sm font-medium text-gray-700">Class Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={class_item.name}
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
            </div>

            <div>
                <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                    id="description"
                    name="description"
                    rows="3"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >{class_item.description}</textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label for="schedule" class="block text-sm font-medium text-gray-700">Schedule</label>
                    <input
                        type="datetime-local"
                        id="schedule"
                        name="schedule"
                        value={new Date(class_item.schedule).toISOString().slice(0, 16)}
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label for="duration" class="block text-sm font-medium text-gray-700">Duration (hours)</label>
                    <input
                        type="number"
                        id="duration"
                        name="duration"
                        value={class_item.duration}
                        min="0.5"
                        step="0.5"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label for="skill_level" class="block text-sm font-medium text-gray-700">Skill Level</label>
                    <select
                        id="skill_level"
                        name="skill_level"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="">All Levels</option>
                        <option value="beginner" selected={class_item.skill_level === 'beginner'}>Beginner</option>
                        <option value="intermediate" selected={class_item.skill_level === 'intermediate'}>Intermediate</option>
                        <option value="advanced" selected={class_item.skill_level === 'advanced'}>Advanced</option>
                    </select>
                </div>

                <div>
                    <label for="max_participants" class="block text-sm font-medium text-gray-700">Max Participants</label>
                    <input
                        type="number"
                        id="max_participants"
                        name="max_participants"
                        value={class_item.max_participants}
                        min="0"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div>
                <label for="gym_id" class="block text-sm font-medium text-gray-700">Gym</label>
                <select
                    id="gym_id"
                    name="gym_id"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                    {#each gyms as gym}
                        <option
                            value={gym.id}
                            selected={gym.id === class_item.gym_id}
                        >
                            {gym.name}
                        </option>
                    {/each}
                </select>
            </div>

            <div class="flex justify-between pt-4">
                
                    href="/classes/{class_item.id}"
                    class="text-gray-600 hover:text-gray-800"
                >
                    Cancel
                </a>
                <div class="space-x-4">
                    {#if confirmingDelete}
                        <form
                            method="POST"
                            action="?/delete"
                            use:enhance
                            class="inline"
                        >
                            <button
                                type="submit"
                                class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                            >
                                Confirm Delete
                            </button>
                            <button
                                type="button"
                                class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                                on:click={() => confirmingDelete = false}
                            >
                                Cancel Delete
                            </button>
                        </form>
                    {:else}
                        <button
                            type="button"
                            class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                            on:click={() => confirmingDelete = true}
                        >
                            Delete Class
                        </button>
                        <button
                            type="submit"
                            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Save Changes
                        </button>
                    {/if}
                </div>
            </div>
        </form>
    </div>
</div>