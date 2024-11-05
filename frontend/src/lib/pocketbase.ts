import PocketBase from 'pocketbase';
import { writable } from 'svelte/store';

export const pb = new PocketBase('http://localhost:3040');

// Create a store for the current user
export const currentUser = writable(pb.authStore.model);

// Update the store when auth state changes
pb.authStore.onChange((auth) => {
    currentUser.set(pb.authStore.model);
});