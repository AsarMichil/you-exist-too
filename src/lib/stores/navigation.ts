import { writable } from 'svelte/store';

export type NavigationDirection = 'forward' | 'backward';

export const navigationDirection = writable<NavigationDirection>('forward'); 