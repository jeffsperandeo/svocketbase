// /src/routes/classes/[id]/+page.server.ts
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { pb } from '$lib/pocketbase';

export const load = (async ({ params, locals }) => {
    if (!locals.user) {
        throw error(401, 'Unauthorized');
    }

    try {
        console.log('Fetching class with ID:', params.id);
        const classItem = await pb.collection('classes').getOne(params.id, {
            expand: 'instructor_id,gym_id'
        });
        console.log('Class data:', classItem);

        // Check if user is the instructor
        const isInstructor = classItem.instructor_id === locals.user.id;
        console.log('Is instructor:', isInstructor);

        // Get registration status
        let isRegistered = false;
        if (!isInstructor) {
            try {
                const registrations = await pb.collection('class_registrations').getList(1, 1, {
                    filter: `class_id = "${params.id}" && student_id = "${locals.user.id}"`
                });
                isRegistered = registrations.totalItems > 0;
                console.log('Is registered:', isRegistered);
            } catch (err) {
                console.error('Error checking registration:', err);
            }
        }

        return {
            class_item: classItem,
            isRegistered,
            isInstructor,
            user: locals.user
        };
    } catch (err) {
        console.error('Error loading class:', err);
        throw error(404, 'Class not found');
    }
}) satisfies PageServerLoad;

export const actions = {
    register: async ({ params, locals }) => {
        if (!locals.user) {
            throw error(401, 'Unauthorized');
        }

        try {
            await pb.collection('class_registrations').create({
                class_id: params.id,
                student_id: locals.user.id,
                status: 'registered'
            });
            return { success: true };
        } catch (err) {
            console.error('Error registering for class:', err);
            throw error(500, 'Failed to register for class');
        }
    },

    unregister: async ({ params, locals }) => {
        if (!locals.user) {
            throw error(401, 'Unauthorized');
        }

        try {
            const registrations = await pb.collection('class_registrations').getList(1, 1, {
                filter: `class_id = "${params.id}" && student_id = "${locals.user.id}"`
            });

            if (registrations.items.length > 0) {
                await pb.collection('class_registrations').delete(registrations.items[0].id);
            }
            return { success: true };
        } catch (err) {
            console.error('Error unregistering from class:', err);
            throw error(500, 'Failed to unregister from class');
        }
    }
};