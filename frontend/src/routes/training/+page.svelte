<!-- /src/routes/training/+page.svelte -->
<script lang="ts">
    import { pb } from '$lib/pocketbase';
    import { onMount } from 'svelte';
    import type { PageData } from './$types';

    export let data: PageData;

    let loading = false;
    let success = false;
    let error = '';
    let showSparring = false;

    let trainingSession = {
        type: 'class', // class or sparring
        date: new Date().toISOString().split('T')[0],
        duration: 60,
        techniques_used: '',
        notes: '',
        gym_id: '',
        result: '',
        partner_id: '',
        technique_id: ''
    };

    // Form states
    let gyms = data.gyms || [];
    let techniques = data.techniques || [];
    let recentPartners = data.recentPartners || [];

    async function handleSubmit() {
        loading = true;
        error = '';
        success = false;

        try {
            const sessionData = {
                ...trainingSession,
                user_id: data.user.id,
                date: new Date(trainingSession.date).toISOString(),
            };

            if (showSparring) {
                await pb.collection('sparring_sessions').create(sessionData);
            } else {
                // Handle regular training session
                // You might want to create a new collection for this
                await pb.collection('sparring_sessions').create(sessionData);
            }

            // Update total training hours in profile
            const profile = await pb.collection('profile').getFirstListItem(
                `user_id="${data.user.id}"`
            );

            const updatedHours = (profile.total_training_hours || 0) + (trainingSession.duration / 60);
            await pb.collection('profile').update(profile.id, {
                total_training_hours: updatedHours
            });

            success = true;
            // Reset form
            trainingSession = {
                type: 'class',
                date: new Date().toISOString().split('T')[0],
                duration: 60,
                techniques_used: '',
                notes: '',
                gym_id: '',
                result: '',
                partner_id: '',
                technique_id: ''
            };
        } catch (e) {
            console.error('Error saving training session:', e);
            error = 'Failed to save training session';
        } finally {
            loading = false;
        }
    }
</script>

<div class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Log Training Session</h1>
        <p class="mt-2 text-sm text-gray-600">Record your training details to track your progress</p>
    </div>

    {#if success}
        <div class="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
            Training session logged successfully!
        </div>
    {/if}

    {#if error}
        <div class="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
        </div>
    {/if}

    <form on:submit|preventDefault={handleSubmit} class="space-y-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <!-- Session Type Toggle -->
        <div class="flex space-x-4 mb-6">
            <button
                type="button"
                class="px-4 py-2 rounded-lg text-sm font-medium transition-colors {!showSparring ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
                on:click={() => showSparring = false}
            >
                Class/Training
            </button>
            <button
                type="button"
                class="px-4 py-2 rounded-lg text-sm font-medium transition-colors {showSparring ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
                on:click={() => showSparring = true}
            >
                Sparring
            </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Date -->
            <div>
                <label for="date" class="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                    type="date"
                    id="date"
                    bind:value={trainingSession.date}
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                />
            </div>

            <!-- Duration -->
            <div>
                <label for="duration" class="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                <input
                    type="number"
                    id="duration"
                    bind:value={trainingSession.duration}
                    min="1"
                    max="480"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                />
            </div>

            <!-- Gym -->
            <div>
                <label for="gym" class="block text-sm font-medium text-gray-700 mb-1">Gym</label>
                <select
                    id="gym"
                    bind:value={trainingSession.gym_id}
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                >
                    <option value="">Select Gym</option>
                    {#each gyms as gym}
                        <option value={gym.id}>{gym.name}</option>
                    {/each}
                </select>
            </div>

            <!-- Techniques -->
            <div>
                <label for="technique" class="block text-sm font-medium text-gray-700 mb-1">Main Technique</label>
                <select
                    id="technique"
                    bind:value={trainingSession.technique_id}
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                    <option value="">Select Technique</option>
                    {#each techniques as technique}
                        <option value={technique.id}>{technique.name}</option>
                    {/each}
                </select>
            </div>

            {#if showSparring}
                <!-- Sparring Partner -->
                <div>
                    <label for="partner" class="block text-sm font-medium text-gray-700 mb-1">Sparring Partner</label>
                    <select
                        id="partner"
                        bind:value={trainingSession.partner_id}
                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    >
                        <option value="">Select Partner</option>
                        {#each recentPartners as session}
                            {#if session.expand?.partner_id}
                                <option value={session.expand.partner_id.id}>
                                    {session.expand.partner_id.name}
                                </option>
                            {/if}
                        {/each}
                    </select>
                </div>

                <!-- Result -->
                <div>
                    <label for="result" class="block text-sm font-medium text-gray-700 mb-1">Result</label>
                    <select
                        id="result"
                        bind:value={trainingSession.result}
                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="">Select Result</option>
                        <option value="Submission Victory">Submission Victory</option>
                        <option value="Submission Loss">Submission Loss</option>
                        <option value="Position Control">Position Control</option>
                        <option value="Learning Experience">Learning Experience</option>
                    </select>
                </div>
            {/if}
        </div>

        <!-- Techniques Used -->
        <div>
            <label for="techniques_used" class="block text-sm font-medium text-gray-700 mb-1">
                Techniques Used/Notes
            </label>
            <textarea
                id="techniques_used"
                bind:value={trainingSession.techniques_used}
                rows="4"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="List techniques practiced or used..."
            ></textarea>
        </div>

        <!-- Notes -->
        <div>
            <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
            <textarea
                id="notes"
                bind:value={trainingSession.notes}
                rows="4"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Any additional notes about the session..."
            ></textarea>
        </div>

        <div class="flex justify-end">
            <button
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={loading}
            >
                {loading ? 'Saving...' : 'Log Training Session'}
            </button>
        </div>
    </form>
</div>