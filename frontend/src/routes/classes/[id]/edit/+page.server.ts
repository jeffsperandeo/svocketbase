// /src/routes/classes/[id]/edit/+page.server.ts
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { pb } from '$lib/pocketbase';

export const load = (async ({ params, locals }) => {
    if (!locals.user) {
        throw error(401, 'Unauthorized');
    }

    try {
        console.log('Loading class for edit:', params.id);
        const classItem = await pb.collection('classes').getOne(params.id);
        console.log('Class data:', classItem);

        if (classItem.instructor_id !== locals.user.id) {
            throw error(403, 'Not authorized to edit this class');
        }

        // Get list of gyms for dropdown
        const gyms = await pb.collection('gyms').getFullList({
            sort: 'name'
        });

        return {
            class_item: classItem,
            gyms: gyms
        };
    } catch (err) {
        console.error('Error loading class for edit:', err);
        throw error(404, 'Class not found');
    }
}) satisfies PageServerLoad;

export const actions = {
    update: async ({ request, params, locals }) => {
        if (!locals.user) {
            throw error(401, 'Unauthorized');
        }

        const formData = await request.formData();
        const updateData = {
            name: formData.get('name'),
            description: formData.get('description'),
            schedule: formData.get('schedule'),
            duration: parseInt(formData.get('duration')?.toString() || '0'),
            skill_level: formData.get('skill_level'),
            max_participants: parseInt(formData.get('max_participants')?.toString() || '0'),
            gym_id: formData.get('gym_id')
        };

        try {
            await pb.collection('classes').update(params.id, updateData);
            throw redirect(303, `/classes/${params.id}`);
        } catch (err) {
            console.error('Error updating class:', err);
            throw error(500, 'Failed to update class');
        }
    },

    delete: async ({ params, locals }) => {
        if (!locals.user) {
            throw error(401, 'Unauthorized');
        }

        try {
            await pb.collection('classes').delete(params.id);
            throw redirect(303, '/classes');
        } catch (err) {
            console.error('Error deleting class:', err);
            throw error(500, 'Failed to delete class');
        }
    }
};