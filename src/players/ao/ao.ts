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
    const seekBar = document.querySelector<HTMLElement>(
      '.ao-player-seekbar, input[type="range"], progress'
    );

    if (
      seekBar instanceof HTMLInputElement ||
      seekBar instanceof HTMLProgressElement
    ) {
      return seekBar.parentElement;
    }

    return seekBar;
  }

  getSettingsButtonElement(): HTMLElement | null {
    const fullscreenTarget = document.querySelector(
      '.ao-player-fullscreen, [aria-label="Full screen"], [title="Full screen"]'
    );

    const fullscreenButton = fullscreenTarget?.closest('button');
    if (fullscreenButton) {
      return fullscreenButton;
    }

    if (fullscreenTarget instanceof HTMLElement) {
      return fullscreenTarget;
    }

    const lastControl = this.getVideoControlsContainer()?.lastElementChild;

    return lastControl instanceof HTMLElement ? lastControl : null;
  }

  injectSkipTimeIndicator(): void {
    const seekBarContainer = this.getSeekBarContainer();
    if (
      seekBarContainer &&
      !document.getElementById(this.skipTimeIndicatorsRenderer.id)
    ) {
      if (window.getComputedStyle(seekBarContainer).position === 'static') {
        seekBarContainer.style.position = 'relative';
      }

      Object.assign(this.skipTimeIndicatorsRenderer.shadowRootContainer.style, {
        position: 'absolute',
        inset: '0',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: '2',
      });

      seekBarContainer.appendChild(
        this.skipTimeIndicatorsRenderer.shadowRootContainer
      );
    }
  }

  injectSubmitMenuButton(): void {
    const controlsContainer = this.getVideoControlsContainer();
    const settingsButtonElement = this.getSettingsButtonElement();
    if (
      (settingsButtonElement || controlsContainer) &&
      !document.getElementById(this.playerButtonsRenderer.id)
    ) {
      Object.assign(this.playerButtonsRenderer.shadowRootContainer.style, {
        display: 'flex',
        alignItems: 'center',
        flex: '0 0 auto',
        height: '36px',
        minWidth: '36px',
        zIndex: '3',
      });

      if (settingsButtonElement?.parentElement) {
        settingsButtonElement.insertAdjacentElement(
          'beforebegin',
          this.playerButtonsRenderer.shadowRootContainer
        );
      } else {
        controlsContainer?.appendChild(
          this.playerButtonsRenderer.shadowRootContainer
        );
      }

      this.playerButtonsRenderer.render();
    }
  }
}
