import browser from 'webextension-polyfill';
import { PlayerFactory } from '../../players/player-factory';
import { Message } from '../background';

const globalWindow = window as typeof window & {
  __aniskipPlayerScriptInjected?: boolean;
};

if (!globalWindow.__aniskipPlayerScriptInjected) {
  globalWindow.__aniskipPlayerScriptInjected = true;

  let player: any = null;
  let hasInitialisedObservers = false;

  /**
   * Initialises player controls if they already exist.
   */
  const initialiseExistingControls = (): void => {
    if (player?.getVideoControlsContainer()) {
      player.initialise();
    }
  };

  /**
   * Initialises video elements already present in the frame.
   */
  const initialiseExistingVideoElements = (): void => {
    const videoElements = document.getElementsByTagName('video');

    for (let i = 0; i < videoElements.length; i += 1) {
      const videoElement = videoElements[i];

      if (videoElement.duration > 60) {
        player.setVideoElement(videoElement);
        player.initialise();
        player.onReady();
      }
    }
  };

  /**
   * Sets up the player observers once a player script is selected.
   */
  const initialisePlayerObservers = (): void => {
    if (!player || hasInitialisedObservers) {
      return;
    }

    hasInitialisedObservers = true;

    // Notify content script when video controls are found.
    new MutationObserver((_mutations, observer) => {
      const videoControlsContainer = player.getVideoControlsContainer();

      if (videoControlsContainer) {
        observer.disconnect();
        player.initialise();
      }
    }).observe(document, { subtree: true, childList: true });

    // Notify content script when video element is found.
    new MutationObserver(() => {
      const videoElements = document.getElementsByTagName('video');

      for (let i = 0; i < videoElements.length; i += 1) {
        const videoElement = videoElements[i];
        videoElement.onloadedmetadata = (event): void => {
          const target = event.currentTarget as HTMLVideoElement;
          if (target.duration > 60) {
            player.setVideoElement(target);
            player.initialise();
            player.onReady();
          }
        };
      }
    }).observe(document, { subtree: true, childList: true });

    initialiseExistingControls();
    initialiseExistingVideoElements();
  };

  /**
   * Selects the player script to use in this frame.
   */
  const selectPlayer = (): void => {
    try {
      if (player) {
        initialiseExistingControls();
        initialiseExistingVideoElements();
        return;
      }

      player = PlayerFactory.getPlayer(window.location.href);
      initialisePlayerObservers();
      initialiseExistingControls();
      initialiseExistingVideoElements();
    } catch {
      // This content script also runs in frames that do not use a supported player.
    }
  };

  selectPlayer();

  /**
   * Handles messages from the content script.
   *
   * @param message Message containing the type of action and the payload.
   */
  const messageHandler = (rawMessage: unknown): any => {
    const message = rawMessage as Message;

    switch (message.type) {
      case 'initialise-skip-times': {
        selectPlayer();

        if (!player?.getIsReady()) {
          return;
        }

        player.initialise();
        player.clearSkipTimes();
        player.initialiseSkipTimes(message.payload);
        break;
      }
      default:
      // no default
    }
  };

  browser.runtime.onMessage.addListener(messageHandler);
}
