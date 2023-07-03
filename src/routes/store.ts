import { writable } from 'svelte/store';

export interface Card {
	name: string;
	imageUrl: string;
}

export const cards = writable([] as Card[]);
