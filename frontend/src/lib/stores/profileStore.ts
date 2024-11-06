import { writable } from 'svelte/store';
import { pb } from '$lib/pocketbase';
import { browser } from '$app/environment';
import { currentUser } from '$lib/pocketbase';

export interface Profile {
    id: string;
    user_id: string;
    belt_rank: string;
    training_start_date: string;
    total_training_hours: number;
    goals: string;
    notable_achievements: string;
    injury_history: string;
    current_weight: string;
    current_height: string;
    guard_style: string;
    submission_specialties: string;
    competition_experience: boolean;
    last_promotion_date: string;
    gym_id?: string;
}

export const profile = writable<Profile | null>(null);

export const loadProfile = async () => {
    try {
        console.log('Loading profile...');
        
        if (!pb.authStore.isValid) {
            console.log('No valid auth');
            profile.set(null);
            return null;
        }

        const userId = pb.authStore.model?.id;
        if (!userId) {
            console.log('No user ID');
            profile.set(null);
            return null;
        }

        // Try to get existing profile
        const records = await pb.collection('profile').getList(1, 1, {
            filter: `user_id = "${userId}"`
        });

        let profileData = records.items[0] || null;

        // If no profile exists, create one
        if (!profileData) {
            console.log('Creating new profile for user');
            profileData = await pb.collection('profile').create({
                user_id: userId,
                belt_rank: 'white',
                training_start_date: new Date().toISOString().split('T')[0],
                total_training_hours: 0,
                goals: '',
                notable_achievements: '',
                injury_history: '',
                current_weight: '',
                current_height: '',
                guard_style: '',
                submission_specialties: '',
                competition_experience: false,
                last_promotion_date: new Date().toISOString().split('T')[0]
            });
        }

        console.log('Profile data:', profileData);
        profile.set(profileData);
        return profileData;
    } catch (err) {
        console.error('Error in loadProfile:', err);
        profile.set(null);
        return null;
    }
};

// Subscribe to auth changes
if (browser) {
    currentUser.subscribe((user) => {
        if (user) {
            loadProfile();
        } else {
            profile.set(null);
        }
    });
}