// src/routes/profile/+page.server.ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { pb } from '$lib/pocketbase';

export const load: PageServerLoad = async ({ locals, cookies }) => {
    if (!locals.user) {
        throw redirect(303, '/login');
    }

    try {
        const profile = await pb.collection('profile').getFirstListItem(
            `user_id="${locals.user.id}"`,
            { expand: 'gym_id' }
        );
        
        return {
            user: locals.user,
            profile
        };
    } catch (error) {
        // Return just the user if profile doesn't exist yet
        return {
            user: locals.user
        };
    }
};