export interface CardInterface extends CardListInterface {
	imageUrl: string;
	set: string;
}

export interface CardListInterface {
	name: string;
	id?: string;
}
