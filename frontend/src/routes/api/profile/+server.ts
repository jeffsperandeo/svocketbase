import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { pb } from '$lib/pocketbase';

export const GET: RequestHandler = async ({ locals }) => {
    if (!locals.user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const records = await pb.collection('profile').getList(1, 1, {
            filter: `user_id = "${locals.user.id}"`,
            expand: 'gym_id'
        });
        return json(records.items[0] || null);
    } catch (err) {
        return json({ error: 'Failed to fetch profile' }, { status: 500 });
    }
};

export const POST: RequestHandler = async ({ request, locals }) => {
    if (!locals.user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const data = await request.json();
        const profile = await pb.collection('profile').create({
            ...data,
            user_id: locals.user.id
        });
        return json(profile);
    } catch (err) {
        return json({ error: 'Failed to create profile' }, { status: 500 });
    }
};

export const PATCH: RequestHandler = async ({ request, locals }) => {
    if (!locals.user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const { id, ...data } = await request.json();
        const profile = await pb.collection('profile').update(id, data);
        return json(profile);
    } catch (err) {
        return json({ error: 'Failed to update profile' }, { status: 500 });
    }
};
