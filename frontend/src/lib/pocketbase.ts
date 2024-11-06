import PocketBase from 'pocketbase';
import { writable } from 'svelte/store';
import { goto } from '$app/navigation';
import { browser } from '$app/environment';

export interface User {
    id: string;
    username: string;
    email: string;
    name: string;
    avatar?: string;
    created: string;
    updated: string;
    emailVisibility: boolean;
    verified: boolean;
}

// Initialize PocketBase instance
export const pb = new PocketBase('http://localhost:3040');

// Initialize currentUser store
export const currentUser = writable<User | null>(null);

if (browser) {
    currentUser.set(pb.authStore.model);

    pb.authStore.onChange((auth) => {
        console.log('Auth state changed:', {
            isValid: pb.authStore.isValid,
            token: !!pb.authStore.token,
            model: auth
        });
        currentUser.set(auth ? pb.authStore.model : null);
    });
}

export const login = async (email: string, password: string) => {
    try {
        console.log('Login attempt:', email);
        const authData = await pb.collection('users').authWithPassword(email, password);

        console.log('Login response:', {
            success: true,
            token: !!authData.token,
            model: !!authData.record
        });

        if (!authData.token) {
            throw new Error('No auth token received');
        }

        currentUser.set(authData.record);

        // Set cookie manually
        document.cookie = pb.authStore.exportToCookie({
            httpOnly: false,
            secure: false,
            sameSite: 'lax'
        });

        await goto('/dashboard');
        return { success: true };
    } catch (err: any) {
        console.error('Login error:', err);
        return {
            success: false,
            error: err.data?.message || err.message || 'Login failed'
        };
    }
};

export const register = async (
    email: string,
    password: string,
    passwordConfirm: string,
    name: string
) => {
    try {
        const username = email.split('@')[0];
        console.log('Starting registration for:', email);

        const data = {
            email,
            password,
            passwordConfirm,
            name,
            username,
            emailVisibility: true
        };

        const record = await pb.collection('users').create(data);
        console.log('User created:', record);

        const authData = await pb.collection('users').authWithPassword(email, password);
        console.log('Auto-login successful:', authData);

        currentUser.set(authData.record);
        await goto('/dashboard');
        return { success: true };
    } catch (err: any) {
        console.error('Registration failed:', err);
        return { success: false, error: err.message };
    }
};

export const logout = async () => {
    pb.authStore.clear();
    currentUser.set(null);
    await goto('/');
    return { success: true };
};

export const isAuthenticated = () => {
    return pb.authStore.isValid && !!pb.authStore.model;
};
