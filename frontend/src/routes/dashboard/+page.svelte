<script lang="ts">
  import { pb } from '$lib/pocketbase';
  import { currentUser } from '$lib/pocketbase';
  import { onMount } from 'svelte';
  
  let profile = null;
  let recentTraining = [];
  let achievements = [];
  let loading = true;
  let error = '';

  async function loadDashboardData() {
      try {
          // Load user profile
          const profileData = await pb.collection('profiles').getFirstListItem(`user="${$currentUser.id}"`);
          profile = profileData;

          // Load recent training sessions
          const trainingSessions = await pb.collection('training_sessions').getList(1, 5, {
              filter: `user="${$currentUser.id}"`,
              sort: '-date'
          });
          recentTraining = trainingSessions.items;

          // Load recent achievements
          const userAchievements = await pb.collection('achievements').getList(1, 5, {
              filter: `user="${$currentUser.id}"`,
              sort: '-date'
          });
          achievements = userAchievements.items;

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
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="bg-white shadow rounded-lg p-6">
      <h1 class="text-2xl font-bold text-gray-900">Welcome, {$currentUser?.name}</h1>
      {#if profile}
          <p class="mt-1 text-gray-600">
              {profile.academy_name} • {profile.preferred_gi_nogi.join(' & ')}
          </p>
      {/if}
  </div>

  {#if loading}
      <div class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
  {:else if error}
      <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
      </div>
  {:else}
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <!-- Recent Training -->
          <div class="bg-white shadow rounded-lg p-6">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Recent Training</h2>
              {#if recentTraining.length > 0}
                  <div class="space-y-4">
                      {#each recentTraining as session}
                          <div class="border-b pb-4 last:border-b-0 last:pb-0">
                              <div class="flex justify-between items-start">
                                  <div>
                                      <p class="font-medium">{session.type}</p>
                                      <p class="text-sm text-gray-600">
                                          {new Date(session.date).toLocaleDateString()}
                                      </p>
                                  </div>
                                  <span class="text-sm text-gray-600">{session.duration} min</span>
                              </div>
                          </div>
                      {/each}
                  </div>
              {:else}
                  <p class="text-gray-500">No recent training sessions</p>
              {/if}
          </div>

          <!-- Achievements -->
          <div class="bg-white shadow rounded-lg p-6">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h2>
              {#if achievements.length > 0}
                  <div class="space-y-4">
                      {#each achievements as achievement}
                          <div class="border-b pb-4 last:border-b-0 last:pb-0">
                              <p class="font-medium">{achievement.title}</p>
                              <p class="text-sm text-gray-600">
                                  {new Date(achievement.date).toLocaleDateString()} • {achievement.type}
                              </p>
                          </div>
                      {/each}
                  </div>
              {:else}
                  <p class="text-gray-500">No achievements yet</p>
              {/if}
          </div>
      </div>
  {/if}
</div>