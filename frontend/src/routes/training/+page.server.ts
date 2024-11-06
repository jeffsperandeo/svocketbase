// /src/routes/training/+page.server.ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { pb } from '$lib/pocketbase';

export const load: PageServerLoad = async ({ locals, cookies }) => {
    if (!locals.user) {
        throw redirect(303, '/login');
    }

    try {
        // Get user's profile and gym
        const profile = await pb.collection('profile').getFirstListItem(
            `user_id="${locals.user.id}"`,
            { expand: 'gym_id' }
        );

        // Get available techniques
        const techniques = await pb.collection('techniques').getList(1, 50, {
            sort: 'name'
        });

        // Get recent sparring partners (distinct partners from last 10 sessions)
        const recentPartners = await pb.collection('sparring_sessions').getList(1, 10, {
            filter: `user_id="${locals.user.id}"`,
            expand: 'partner_id',
            sort: '-date'
        });

        // Get available gyms
        const gyms = await pb.collection('gyms').getList(1, 50, {
            sort: 'name'
        });

        return {
            user: locals.user,
            profile,
            techniques: techniques.items,
            recentPartners: recentPartners.items,
            gyms: gyms.items
        };
    } catch (error) {
        console.error('Error loading training data:', error);
        return {
            user: locals.user,
            error: 'Failed to load training data'
        };
    }
};