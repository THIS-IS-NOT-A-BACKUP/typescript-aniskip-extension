import { Player } from '../players/base-player.types';
import { PlayerFactory } from '../players/player-factory';
import { getAvailablePages } from './page-list';

export type PlayerInfo = {
  id: string;
  label: string;
};

type PlayerClass = {
  new (): Player;
  getMetadata(): { variant: string };
};

/**
 * Gets a list of all available player scripts with their metadata.
 */
export function getAvailablePlayers(): PlayerInfo[] {
  return (PlayerFactory.players as PlayerClass[]).map((PlayerClass, index) => {
    const { variant } = PlayerClass.getMetadata();

    return {
      id: `player-${index}`,
      label: variant.toUpperCase(),
    };
  });
}

/**
 * Gets a player class by its id.
 *
 * @param playerId The player id (e.g., 'player-0').
 */
export function getPlayerById(playerId: string): PlayerClass | null {
  const index = parseInt(playerId.replace('player-', ''), 10);
  if (
    Number.isNaN(index) ||
    index < 0 ||
    index >= PlayerFactory.players.length
  ) {
    return null;
  }

  return PlayerFactory.players[index] as PlayerClass;
}

/**
 * Gets the related player script id for a manually selected site.
 *
 * @param pageId The selected page id.
 */
export function getPlayerIdByPageId(pageId: string): string {
  const pageOption = getAvailablePages().find((option) => option.id === pageId);
  const playerOptions = getAvailablePlayers();

  const playerLabel = ((): string | undefined => {
    switch (pageOption?.label) {
      case 'Animeonsen':
        return 'AO';
      case 'Animepahe':
        return 'PLYR';
      case 'Crunchyroll':
      case 'Crunchyroll Beta':
        return 'CRUNCHYROLL';
      default:
        return undefined;
    }
  })();

  return (
    playerOptions.find((playerOption) => playerOption.label === playerLabel)
      ?.id ??
    playerOptions[0]?.id ??
    ''
  );
}
