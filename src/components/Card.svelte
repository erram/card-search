<script lang="ts">
	import { fly } from 'svelte/transition';
	import type { Card } from '../routes/store';

	export let card: Card;
	export let loaded: () => void;

	function preload(src: string) {
		return new Promise(function (resolve) {
			let img = new Image();
			img.onload = resolve;
			img.src = src;
		}).then(loaded);
	}
</script>

<div>
	{#await preload(card.imageUrl) then}
		<img src={card.imageUrl} in:fly alt={card.name} />
		<p>{card.name}</p>
	{:catch error}
		<p style="color: red">{error.message}</p>
	{/await}
</div>
