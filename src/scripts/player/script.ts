import browser from 'webextension-polyfill';
import { PlayerFactory } from '../../players/player-factory';
import { Message } from '../background';

let player: any = null;

try {
  player = PlayerFactory.getPlayer(window.location.href);
} catch {
  // This content script also runs in frames that do not use a supported player.
}

// Only set up observers if player was successfully initialized
if (player) {
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
}

/**
 * Handles messages from the content script.
 *
 * @param message Message containing the type of action and the payload.
 */
const messageHandler = (rawMessage: unknown): any => {
  const message = rawMessage as Message;

  switch (message.type) {
    case 'initialise-skip-times': {
      if (!player?.getIsReady()) {
        return;
      }

      player.clearSkipTimes();
      player.initialiseSkipTimes(message.payload);
      break;
    }
    default:
    // no default
  }
};

browser.runtime.onMessage.addListener(messageHandler);
