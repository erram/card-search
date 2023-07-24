<script lang="ts">
	import { onMount } from 'svelte';
	import Card from '../components/Card.svelte';
	import type { CardInterface } from '../interface';
	import { fade } from 'svelte/transition';

	let isLoading: boolean = false;
	let cardName: string = '';
	let errorMessage: string = '';
	let cardList: CardInterface[] = [];
	let selectedCard: CardInterface = { name: '', imageUrl: '', set: '' };
	let symbol: string = '';

	function getRandomSymbol(): string {
		const symbols = ['w', 'u text-blue-800', 'b', 'r text-red-800', 'g text-green-800'];
		return symbols[Math.floor(Math.random() * symbols.length)];
	}

	let timer: string | number | NodeJS.Timeout | undefined;

	const debounce = (e: any) => {
		clearTimeout(timer);
		cardName = e.target.value;
		timer = setTimeout(() => {
			getCard(cardName);
		}, 500);
	};

	onMount(() => {
		symbol = getRandomSymbol();
	});

	function bold(word: string, sentence: string): string {
		const reg = new RegExp(word, 'ig');
		return sentence.replace(reg, '<b>$&</b>');
	}

	async function preloadImage(src: string) {
		await new Promise(function (resolve) {
			let img = new Image();
			img.onload = resolve;
			img.src = src;
		});
		isLoading = false;
	}

	function selectCard(card: CardInterface) {
		isLoading = true;
		selectedCard = card;
		cardList = [];
	}

	async function getCard(cardName: string) {
		errorMessage = '';
		isLoading = true;
		selectedCard = { name: '', imageUrl: '', set: '' };
		cardList = [];
		const res = await fetch(
			`https://api.magicthegathering.io/v1/cards?name=${cardName}&contains=imageUrl&pageSize=10`
		);
		if (res.ok) {
			const result = await res.json();
			for (let i = 0; i < result.cards.length; i++) {
				cardList = [
					...cardList,
					{
						name: result.cards[i].name,
						imageUrl: result.cards[i].imageUrl,
						set: result.cards[i].set
					}
				];
				cardList = cardList.filter(
					(card, index, self) => index === self.findIndex((t) => t.set === card.set)
				);
			}
			isLoading = false;
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

<div>
	<div class="relative w-96 bg-white py-4 px-6 overflow-hidden rounded-2xl" out:fade>
		<form autocomplete="off" on:submit|preventDefault={() => getCard(cardName)}>
			<div class="w-full h-min flex items-center justify-between">
				<div class="{isLoading ? 'animate-spin' : ''} origin-center w-8 h-8">
					<p class="ms ms-{symbol} text-2xl text-[#06283D] w-4 h-4 relative top-[-4px] left-1" />
				</div>
				<input
					class="w-4/5 text-[#06283D] text-xl font-bold pl-6 placeholder:text-[#06283D] placeholder:capitalize"
					bind:value={cardName}
					on:input={(event) => debounce(event)}
					type="text"
					placeholder="Search for a card"
				/>
				<button
					type="submit"
					class="fa-solid fa-magnifying-glass cursor-pointer w-14 h-14 text-white bg-[#06283D] rounded-full transition ease-in-out delay-150 hover:text-[#06283D] hover:bg-[#dff6ff]"
				/>
			</div>
		</form>
		{#if !errorMessage}
			{#await preloadImage(selectedCard.imageUrl) then}
				<Card card={selectedCard} />
			{:catch error}
				<p style="color: red">{error.message}</p>
			{/await}
		{/if}
		{#if errorMessage}
			<p style="color: red">{errorMessage}</p>
		{/if}
	</div>
	<!-- Search list -->
	{#if cardList.length > 0}
		<ul class="relative w-96 bg-white py-4 px-6 overflow-hidden rounded-2xl mt-2">
			{#each cardList as card, i}
				<li class="hover:bg-[#06283D] hover:text-white py-2 px-1 mb-2 rounded-md cursor-pointer">
					<p
						on:click={() => selectCard({ name: card.name, imageUrl: card.imageUrl, set: card.set })}
					>
						{@html bold(cardName, card.name)} ({card.set})
					</p>
				</li>
			{/each}
		</ul>
	{/if}
</div>
