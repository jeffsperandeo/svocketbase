import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    plugins: [sveltekit()],
    server: {
        port: 3099,
        host: '0.0.0.0'
    },
    resolve: {
        alias: {
            '@': path.resolve('./src')
        }
    }
});