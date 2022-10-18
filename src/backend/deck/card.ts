export type CardType = 'entity';

export interface Card<T extends CardType = any> {
  readonly type?: T;
  readonly name: string;
  readonly cost: number;
}

export interface EntityCard extends Card<'entity'> {
  readonly hp: number;
}

export const EntityCard = (card: Partial<EntityCard>): EntityCard => {
  return { ...DEFAULT_ENTITY_CARD, ...card, type: 'entity' };
};

export const isEntityCard = (card: Card): card is EntityCard => {
  return (card as unknown as Card).type === 'entity';
};

const DEFAULT_ENTITY_CARD: EntityCard = {
  type: 'entity',
  name: 'ENTITY',
  cost: 1,
  hp: 1,
};
