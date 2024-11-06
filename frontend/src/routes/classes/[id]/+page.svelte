<script lang="ts">
    import { enhance } from '$app/forms';
    import { goto } from '$app/navigation';
    import type { PageData } from './$types';

    export let data: PageData;
    
    let { class_item, isInstructor, isRegistered } = data;

    function formatDate(dateString: string) {
        return new Date(dateString).toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    async function handleEdit() {
        await goto(`/classes/${class_item.id}/edit`);
    }
</script>

<div class="container mx-auto px-4 py-8">
    <div class="bg-white rounded-lg shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-3xl font-bold">{class_item.name}</h1>
            {#if isInstructor}
                <button
                    on:click={handleEdit}
                    class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Edit Class
                </button>
            {/if}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h2 class="text-xl font-semibold mb-2">Details</h2>
                <p class="mb-2"><strong>Schedule:</strong> {formatDate(class_item.schedule)}</p>
                <p class="mb-2"><strong>Duration:</strong> {class_item.duration} hour(s)</p>
                <p class="mb-2"><strong>Skill Level:</strong> {class_item.skill_level || 'All Levels'}</p>
                <p class="mb-2"><strong>Max Participants:</strong> {class_item.max_participants || 'Unlimited'}</p>
                <p class="mb-4"><strong>Description:</strong> {class_item.description}</p>
            </div>

            <div>
                <h2 class="text-xl font-semibold mb-2">Location & Instructor</h2>
                {#if class_item.expand?.gym_id}
                    <p class="mb-2"><strong>Gym:</strong> {class_item.expand.gym_id.name}</p>
                    <p class="mb-2"><strong>Address:</strong> {class_item.expand.gym_id.location}</p>
                {/if}
                {#if class_item.expand?.instructor_id}
                    <p class="mb-2">
                        <strong>Instructor:</strong> {class_item.expand.instructor_id.name}
                    </p>
                {/if}
            </div>
        </div>

        {#if !isInstructor}
            <div class="mt-6">
                <form
                    method="POST"
                    action="?/{isRegistered ? 'unregister' : 'register'}"
                    use:enhance
                >
                    <button
                        type="submit"
                        class="w-full {isRegistered ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white px-4 py-2 rounded"
                    >
                        {isRegistered ? 'Unregister from Class' : 'Register for Class'}
                    </button>
                </form>
            </div>
        {/if}

        <div class="mt-6">
            <a href="/classes" class="text-blue-500 hover:text-blue-600">
                ← Back to Classes
            </a>
        </div>
    </div>
</div>