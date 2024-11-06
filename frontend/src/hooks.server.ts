import { redirect, type Handle } from '@sveltejs/kit';
import { pb } from '$lib/pocketbase';

export const handle: Handle = async ({ event, resolve }) => {
    console.log('\n=== Request Start ===');
    console.log('Path:', event.url.pathname);

    // Always use backend service URL within Docker network
    pb.baseUrl = 'http://backend:3040';
    
    console.log('Using PocketBase URL:', pb.baseUrl);
    console.log('Auth Store Valid:', pb.authStore.isValid);
    console.log('Auth Token:', pb.authStore.token);

    event.locals.user = null;
    const authCookie = event.request.headers.get('cookie');
    console.log('Received cookies:', authCookie);

    if (authCookie) {
        try {
            pb.authStore.loadFromCookie(authCookie);

            if (pb.authStore.isValid && pb.authStore.model) {
                event.locals.user = structuredClone(pb.authStore.model);
                console.log('Auth loaded successfully');
                console.log('User ID:', event.locals.user.id);
                
                // Test the auth token
                try {
                    await pb.collection('users').getOne(event.locals.user.id);
                    console.log('Auth token validated successfully');
                } catch (err) {
                    console.error('Auth token validation failed:', err);
                    pb.authStore.clear();
                }
            } else {
                console.log('Auth token invalid or expired');
                pb.authStore.clear();
            }
        } catch (err) {
            console.error('Error loading auth:', err);
            pb.authStore.clear();
        }
    }

    const protectedPaths = ['/dashboard', '/profile', '/training', '/achievements'];
    const isProtectedPath = protectedPaths.some(path => event.url.pathname.startsWith(path));

    console.log('Route protected:', isProtectedPath);
    console.log('User authenticated:', !!event.locals.user);

    if (isProtectedPath && !event.locals.user) {
        console.log('Redirecting to login');
        throw redirect(303, '/login');
    }

    // Add PocketBase auth header to all requests
    if (pb.authStore.isValid) {
        event.request.headers.set('Authorization', pb.authStore.token);
    }

    const response = await resolve(event);

    if (pb.authStore.isValid) {
        const cookie = pb.authStore.exportToCookie({
            secure: false,
            sameSite: 'lax',
            httpOnly: false,
            path: '/'
        });

        response.headers.set('set-cookie', cookie);
        console.log('Auth cookie set in response');
    }

    console.log('=== Request End ===\n');
    return response;
};