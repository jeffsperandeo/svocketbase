// @ts-nocheck
// src/routes/classes/+page.server.ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { pb } from '$lib/pocketbase';

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
    if (!locals.user) {
        throw redirect(303, '/login');
    }

    try {
        // Get user's roles to check if they're an instructor
        const userRoles = await pb.collection('user_roles').getList(1, 1, {
            filter: `user_id="${locals.user.id}"`,
            expand: 'role_id'
        });

        const isInstructor = userRoles.items.some(role => 
            role.expand?.role_id?.name === 'instructor'
        );

        // Get upcoming classes
        const upcomingClasses = await pb.collection('classes').getList(1, 20, {
            filter: 'schedule >= @now',
            sort: 'schedule',
            expand: 'instructor_id,gym_id'
        });

        // If user is instructor, get their classes
        let instructorClasses = [];
        if (isInstructor) {
            instructorClasses = await pb.collection('classes').getList(1, 20, {
                filter: `instructor_id = "${locals.user.id}"`,
                sort: '-schedule',
                expand: 'gym_id'
            });
        }

        // Get user's gym affiliation
        const profile = await pb.collection('profile').getFirstListItem(
            `user_id="${locals.user.id}"`,
            { expand: 'gym_id' }
        );

        // Get favorite/home gym's classes
        let gymClasses = [];
        if (profile.gym_id) {
            gymClasses = await pb.collection('classes').getList(1, 20, {
                filter: `gym_id = "${profile.gym_id}" && schedule >= @now`,
                sort: 'schedule',
                expand: 'instructor_id'
            });
        }

        return {
            user: locals.user,
            isInstructor,
            upcomingClasses: upcomingClasses.items,
            instructorClasses: instructorClasses.items,
            gymClasses: gymClasses.items,
            userGym: profile.expand?.gym_id
        };
    } catch (error) {
        console.error('Error loading classes:', error);
        return {
            user: locals.user,
            error: 'Failed to load classes'
        };
    }
};