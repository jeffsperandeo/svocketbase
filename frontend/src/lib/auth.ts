import { pb } from '$lib/pocketbase';
import { redirect } from '@sveltejs/kit';
import type { Load } from '@sveltejs/kit';

export const protectedLoader: Load = async ({ url }) => {
    if (!pb.authStore.isValid) {
        throw redirect(303, `/login?redirectTo=${url.pathname}`);
    }
    
    return {
        user: pb.authStore.model
    };
};