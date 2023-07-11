<script lang="ts">
	import type { CardInterface } from '../interface';

	export let card: CardInterface;

</script>

    <div class="text-center opacity-0 animate-fadeIn" style="animation-delay: 0.3s;">
        <p class="bold mt-3">{card.name} ({card.set})</p>
		<img class="w-3/4 mt-4 inline" src={card.imageUrl} alt={card.name} />
    </div>

