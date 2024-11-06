import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { pb } from '$lib/pocketbase';

export const POST: RequestHandler = async () => {
    pb.authStore.clear();
    throw redirect(303, '/');
};