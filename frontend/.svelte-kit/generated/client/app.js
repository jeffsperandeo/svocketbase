export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17'),
	() => import('./nodes/18'),
	() => import('./nodes/19'),
	() => import('./nodes/20'),
	() => import('./nodes/21'),
	() => import('./nodes/22'),
	() => import('./nodes/23'),
	() => import('./nodes/24'),
	() => import('./nodes/25')
];

export const server_loads = [];

export const dictionary = {
		"/": [8],
		"/achievements": [12],
		"/admin/classes": [~13,[2]],
		"/admin/gyms": [~14,[2]],
		"/classes": [~15,[4]],
		"/classes/[id]": [~16,[4]],
		"/dashboard": [17],
		"/gyms": [~18,[5]],
		"/gyms/[id]": [~19,[5]],
		"/(auth)/login": [9],
		"/(auth)/logout": [~10],
		"/profile": [~20],
		"/(auth)/register": [11],
		"/sparring": [~21,[6]],
		"/sparring/[id]": [~22,[6]],
		"/techniques": [~23,[7]],
		"/techniques/[id]": [~24,[7]],
		"/training": [25]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),

	reroute: (() => {})
};

export { default as root } from '../root.js';