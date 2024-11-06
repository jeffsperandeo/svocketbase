import { redirect, type Handle } from '@sveltejs/kit';
import { pb } from '$lib/pocketbase';

export const handle: Handle = async ({ event, resolve }) => {
    console.log('\n=== Request Start ===');
    console.log('Path:', event.url.pathname);

    event.locals.user = null;
    const authCookie = event.request.headers.get('cookie');
    console.log('Received cookies:', authCookie);

    if (authCookie) {
        try {
            pb.authStore.loadFromCookie(authCookie);

            if (pb.authStore.isValid && pb.authStore.model) {
                event.locals.user = structuredClone(pb.authStore.model);
                console.log('Auth loaded successfully');
            } else {
                console.log('Auth token invalid or expired');
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
