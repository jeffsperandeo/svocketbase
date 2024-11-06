// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { pb } from '$lib/pocketbase';

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
    if (!locals.user) {
        throw redirect(303, '/login');
    }

    try {
        console.log('Loading classes for user:', locals.user.id);

        // Get all classes
        const allClasses = await pb.collection('classes').getList(1, 50, {
            sort: '+schedule',
            expand: 'instructor_id,gym_id'
        });

        console.log('Found classes:', allClasses);

        // Check if user is instructor
        const userRoles = await pb.collection('user_roles').getList(1, 1, {
            filter: `user_id = "${locals.user.id}"`,
            expand: 'role_id'
        });

        const isInstructor = userRoles.items.some(role => 
            role.expand?.role_id?.name === 'Gym Owner'
        );

        // Get user's gym info
        const profile = await pb.collection('profile').getFirstListItem(
            `user_id = "${locals.user.id}"`
        ).catch(() => null);

        let gymClasses = [];
        if (profile?.gym_id) {
            gymClasses = await pb.collection('classes').getList(1, 20, {
                filter: `gym_id = "${profile.gym_id}"`,
                sort: '+schedule',
                expand: 'instructor_id'
            });
        }

        return {
            user: locals.user,
            isInstructor,
            upcomingClasses: allClasses.items,
            instructorClasses: isInstructor ? allClasses.items.filter(c => c.instructor_id === locals.user.id) : [],
            gymClasses: gymClasses.items || [],
            userGym: profile?.gym_id ? { id: profile.gym_id } : null
        };
    } catch (error) {
        console.error('Error loading classes:', error);
        return {
            user: locals.user,
            isInstructor: false,
            upcomingClasses: [],
            instructorClasses: [],
            gymClasses: [],
            userGym: null,
            error: 'Failed to load classes'
        };
    }
};