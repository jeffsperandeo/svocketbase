// src/lib/pocketbase.ts
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

export const pb = new PocketBase(browser ? 'http://localhost:3040' : 'http://backend:3040');
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
        const authData = await pb.collection('users').authWithPassword(email, password);
        if (!authData.token) {
            throw new Error('No auth token received');
        }
        currentUser.set(authData.record);
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
        const data = {
            email,
            password,
            passwordConfirm,
            name,
            username,
            emailVisibility: true
        };
        const record = await pb.collection('users').create(data);
        const authData = await pb.collection('users').authWithPassword(email, password);
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