<!-- src/routes/profile/+page.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { pb } from '$lib/pocketbase';
    import type { PageData } from './$types';
    
    export let data: PageData;
    
    let profile = {
        belt_rank: '',
        training_start_date: '',
        total_training_hours: 0,
        goals: '',
        notable_achievements: '',
        injury_history: '',
        current_weight: '',
        current_height: '',
        guard_style: '',
        submission_specialties: '',
        competition_experience: false,
        last_promotion_date: ''
    };
    
    let isEditing = false;
    let isSaving = false;
    let errorMessage = '';

    // Calculate training duration in years and months
    $: trainingDuration = profile.training_start_date ? 
        calculateDuration(new Date(profile.training_start_date)) : null;

    function calculateDuration(startDate: Date) {
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - startDate.getTime());
        const years = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
        const months = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
        return { years, months };
    }
    
    onMount(async () => {
        try {
            const record = await pb.collection('profile').getFirstListItem(
                `user_id="${data.user.id}"`,
                { expand: 'gym_id' }
            );
            profile = { ...record };
        } catch (error) {
            console.error('Error fetching profile:', error);
            errorMessage = 'Failed to load profile data';
        }
    });

    async function handleSubmit() {
        isSaving = true;
        errorMessage = '';
        
        try {
            if (profile.id) {
                await pb.collection('profile').update(profile.id, profile);
            } else {
                await pb.collection('profile').create({
                    ...profile,
                    user_id: data.user.id
                });
            }
            isEditing = false;
        } catch (error) {
            console.error('Error saving profile:', error);
            errorMessage = 'Failed to save profile data';
        } finally {
            isSaving = false;
        }
    }
</script>

<div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center mb-8">
        <div>
            <h1 class="text-4xl font-bold text-gray-900">BJJ Journey</h1>
            <p class="mt-2 text-sm text-gray-600">Track your progress and set your goals</p>
        </div>
        <button 
            class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            on:click={() => isEditing = !isEditing}
        >
            {isEditing ? 'Cancel Editing' : 'Edit Profile'}
        </button>
    </div>

    {#if errorMessage}
        <div class="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {errorMessage}
        </div>
    {/if}

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Belt Rank Card -->
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div class="text-sm font-medium text-gray-500 mb-1">Current Rank</div>
            <div class="text-2xl font-bold text-gray-900">{profile.belt_rank || 'Not Set'}</div>
            {#if profile.last_promotion_date}
                <div class="text-sm text-gray-500 mt-2">
                    Since {new Date(profile.last_promotion_date).toLocaleDateString()}
                </div>
            {/if}
        </div>

        <!-- Training Duration Card -->
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div class="text-sm font-medium text-gray-500 mb-1">Training Duration</div>
            {#if trainingDuration}
                <div class="text-2xl font-bold text-gray-900">
                    {trainingDuration.years}y {trainingDuration.months}m
                </div>
                <div class="text-sm text-gray-500 mt-2">
                    Started {new Date(profile.training_start_date).toLocaleDateString()}
                </div>
            {:else}
                <div class="text-gray-500">Not set</div>
            {/if}
        </div>

        <!-- Mat Time Card -->
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div class="text-sm font-medium text-gray-500 mb-1">Total Mat Hours</div>
            <div class="text-2xl font-bold text-gray-900">{profile.total_training_hours || 0}</div>
            <div class="text-sm text-gray-500 mt-2">Hours on the mat</div>
        </div>
    </div>

    <form on:submit|preventDefault={handleSubmit} class="space-y-6 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Belt Rank -->
            <div>
                <label for="belt_rank" class="block text-sm font-medium text-gray-700 mb-1">Belt Rank</label>
                <select 
                    id="belt_rank"
                    bind:value={profile.belt_rank}
                    disabled={!isEditing}
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50"
                >
                    <option value="">Select Belt</option>
                    <option value="White">White Belt</option>
                    <option value="Blue">Blue Belt</option>
                    <option value="Purple">Purple Belt</option>
                    <option value="Brown">Brown Belt</option>
                    <option value="Black">Black Belt</option>
                </select>
            </div>

            <!-- Training Start Date -->
            <div>
                <label for="training_start_date" class="block text-sm font-medium text-gray-700 mb-1">
                    Training Start Date
                </label>
                <input 
                    type="date"
                    id="training_start_date"
                    bind:value={profile.training_start_date}
                    disabled={!isEditing}
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50"
                />
            </div>

            <!-- Last Promotion Date -->
            <div>
                <label for="last_promotion_date" class="block text-sm font-medium text-gray-700 mb-1">
                    Last Promotion Date
                </label>
                <input 
                    type="date"
                    id="last_promotion_date"
                    bind:value={profile.last_promotion_date}
                    disabled={!isEditing}
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50"
                />
            </div>

            <!-- Total Training Hours -->
            <div>
                <label for="total_training_hours" class="block text-sm font-medium text-gray-700 mb-1">
                    Total Training Hours
                </label>
                <input 
                    type="number"
                    id="total_training_hours"
                    bind:value={profile.total_training_hours}
                    disabled={!isEditing}
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50"
                />
            </div>

            <!-- Guard Style -->
            <div>
                <label for="guard_style" class="block text-sm font-medium text-gray-700 mb-1">
                    Favorite Guard Style
                </label>
                <input 
                    type="text"
                    id="guard_style"
                    bind:value={profile.guard_style}
                    disabled={!isEditing}
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50"
                />
            </div>

            <!-- Submission Specialties -->
            <div>
                <label for="submission_specialties" class="block text-sm font-medium text-gray-700 mb-1">
                    Submission Specialties
                </label>
                <input 
                    type="text"
                    id="submission_specialties"
                    bind:value={profile.submission_specialties}
                    disabled={!isEditing}
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50"
                />
            </div>
        </div>

        <!-- Goals -->
        <div>
            <label for="goals" class="block text-sm font-medium text-gray-700 mb-1">Training Goals</label>
            <textarea
                id="goals"
                bind:value={profile.goals}
                disabled={!isEditing}
                rows="4"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50"
            ></textarea>
        </div>

        <!-- Notable Achievements -->
        <div>
            <label for="notable_achievements" class="block text-sm font-medium text-gray-700 mb-1">
                Notable Achievements
            </label>
            <textarea
                id="notable_achievements"
                bind:value={profile.notable_achievements}
                disabled={!isEditing}
                rows="4"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50"
            ></textarea>
        </div>

        <!-- Competition Experience -->
        <div class="flex items-center">
            <input 
                type="checkbox"
                id="competition_experience"
                bind:checked={profile.competition_experience}
                disabled={!isEditing}
                class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:bg-gray-100"
            />
            <label for="competition_experience" class="ml-2 block text-sm text-gray-700">
                Competition Experience
            </label>
        </div>

        {#if isEditing}
            <div class="flex justify-end space-x-4 pt-4 border-t">
                <button
                    type="button"
                    on:click={() => isEditing = false}
                    class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                    disabled={isSaving}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    disabled={isSaving}
                >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        {/if}
    </form>
</div>