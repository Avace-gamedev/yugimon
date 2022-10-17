export interface Card {
  readonly name: string;
}

export interface EntityCard extends Card {
  readonly hp: number;
}

export interface Deck {
  readonly cards: ReadonlyArray<Card>;
}
