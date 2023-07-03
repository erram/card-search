<script lang="ts">
	import { cards } from './store';
	import { Jumper } from 'svelte-loading-spinners';
	import Card from '../components/Card.svelte';

	let isLoading: boolean = false;
	let cardName: string = '';
	let errorMessage: string = '';

	async function getCard(cardName: string) {
		errorMessage = '';
		cards.set([]);
		isLoading = true;
		const res = await fetch(`https://api.magicthegathering.io/v1/cards?name=${cardName}`);
		if (res.ok) {
			const result = await res.json();
			cards.set(result.cards);
			if (result.cards.length === 0) {
				errorMessage = 'No cards found';
				isLoading = false;
			}
		} else {
			errorMessage = 'Something went wrong';
			isLoading = false;
		}
	}
</script>

<h1>Welcome to Card Search</h1>
<input
	bind:value={cardName}
	on:keydown={() => getCard(cardName)}
	type="text"
	placeholder="Search for a card"
/>
<button on:click={() => getCard(cardName)}>Search</button>

{#if isLoading}
	<Jumper size="60" color="#FF3E00" unit="px" duration="1s" />
{/if}
{#if $cards[0]}
	<Card card={$cards[0]} loaded={() => (isLoading = false)} />
{/if}
{#if errorMessage}
	<p style="color: red">{errorMessage}</p>
{/if}
