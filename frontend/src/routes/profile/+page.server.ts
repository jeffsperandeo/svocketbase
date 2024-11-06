import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { pb } from '$lib/pocketbase';

export const load: PageServerLoad = async ({ locals, cookies }) => {
    console.log('=== Profile Page Load ===');
    console.log('User in locals:', locals.user);
    console.log('Auth state:', {
        isValid: pb.authStore.isValid,
        hasModel: !!pb.authStore.model
    });
    
    const authCookie = cookies.get('pb_auth');
    console.log('Auth cookie present:', !!authCookie);

    if (!locals.user) {
        throw redirect(303, '/login');
    }

    return {
        user: locals.user
    };
};