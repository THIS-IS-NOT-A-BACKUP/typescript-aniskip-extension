import { BasePlayer } from '../base-player';
import { Metadata } from '../base-player.types';
import metadata from './metadata.json';

export class Ao extends BasePlayer {
  constructor() {
    super(metadata);
  }

  static getMetadata(): Metadata {
    return metadata;
  }

  getVideoContainer(): HTMLElement | null {
    return document.querySelector('.ao-player-media');
  }

  getVideoControlsContainer(): HTMLElement | null {
    return document.querySelector('.ao-player-controls');
  }

  getSeekBarContainer(): HTMLElement | null {
    return document.querySelector('.ao-player-seekbar');
  }

  getSettingsButtonElement(): HTMLElement | null {
    return document.querySelector('.ao-player-fullscreen');
  }
  
}