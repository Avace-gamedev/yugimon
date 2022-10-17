import { Game, Move } from 'boardgame.io';
import { Character } from '../character/character';
import { CharacterState, CombatParams, CombatState, Player } from './combat';
import { shuffle } from '../deck/deck-utils';
import { INVALID_MOVE } from 'boardgame.io/core';
import { isEntityCard } from '../deck/card';

export class CombatBuilder {
  constructor(private player: Character, private opponent: Character, private params: CombatParams = null) {}

  build(): Game<CombatState> {
    return {
      setup: ({ ctx }) => {
        return {
          playerState: initialCharacterState(this.player),
          opponentState: initialCharacterState(this.opponent),
        };
      },

      phases: {
        play: {
          start: true,

          onBegin: ({ G }) => {
            draw(G.playerState, this.params?.deckSize ?? 6);
            draw(G.opponentState, this.params?.deckSize ?? 6);
          },
        },
      },

      endIf: ({ G }) => {
        const playerLost = characterHasLost(G.playerState);
        const opponentLost = characterHasLost(G.opponentState);

        if (playerLost && opponentLost) {
          return { draw: true };
        }

        if (playerLost) {
          return { winner: '1' };
        }

        if (opponentLost) {
          return { winner: '0' };
        }

        return false;
      },
    };
  }
}

// -------------------------------------------------------------------------------------
// Game logic
// -------------------------------------------------------------------------------------

const drawCard: Move<CombatState> = ({ G, ctx, playerID: player }): typeof INVALID_MOVE | void => {
  const characterState = getCharacterState(G, player as Player);
  drawOnce(characterState);
};

const characterHasLost = (characterState: CharacterState): boolean => {
  return (
    characterState.deckState.deck.every(c => !isEntityCard(c)) &&
    characterState.deckState.hand.every(c => !isEntityCard(c)) &&
    characterState.deckState.board.every(c => !isEntityCard(c))
  );
};

// -------------------------------------------------------------------------------------
// Utils
// -------------------------------------------------------------------------------------

function initialCharacterState(character: Character): CharacterState {
  return {
    character,
    deckState: {
      hand: [],
      board: [],
      discard: [],
      deck: shuffle(character.deck.cards),
    },
  };
}

const getCharacterState = (G: CombatState, player: Player): CharacterState => {
  switch (player) {
    case '0':
      return G.playerState;
    case '1':
      return G.opponentState;
    default:
      return null;
  }
};

const drawOnce = (characterState: CharacterState) => {
  if (characterState.deckState.deck.length === 0) {
    return false;
  }

  characterState.deckState.hand.push(characterState.deckState.deck.pop());

  return true;
};

const draw = (characterState: CharacterState, n: number) => {
  for (let i = 0; i < n; i++) {
    if (!drawOnce(characterState)) {
      return;
    }
  }
};
