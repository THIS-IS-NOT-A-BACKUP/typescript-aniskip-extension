import browser from 'webextension-polyfill';
import { Message } from '../background';
import { PageFactory } from '../../pages/page-factory';
import { getPageById } from '../../utils/page-list';

const page = PageFactory.getPage(window.location.href);

/**
 * Injects the overlay.
 */
const injectOverlayListener = (): void => {
  page.injectOverlay();

  document.removeEventListener('DOMContentLoaded', injectOverlayListener);
};

// Inject search overlay once when the document body loads.
document.addEventListener('DOMContentLoaded', injectOverlayListener);

/**
 * Handles messages from the player script.
 *
 * @param message Message containing the type of action and the payload.
 */
const messageHandler = (rawMessage: unknown): any => {
  const message = rawMessage as Message;

  switch (message.type) {
    case 'get-episode-information': {
      (async (): Promise<void> => {
        await page.applyRules();
        const malId = await page.getMalId();
        const providerName = page.getProviderName();
        const episodeNumber = page.getEpisodeNumber();

        if (malId === 0) {
          browser.runtime.sendMessage({
            payload: { error: 'MAL id not found' },
            uuid: message.uuid,
          } as Message);

          page.openOverlay();

          return;
        }

        browser.runtime.sendMessage({
          payload: { malId, providerName, episodeNumber },
          uuid: message.uuid,
        } as Message);
      })();
      break;
    }
    case 'fetch-skips-for-page': {
      (async (): Promise<void> => {
        const { pageId, playerId } = message.payload || {};
        if (!pageId) {
          return;
        }

        const PageClass = getPageById(pageId);

        if (!PageClass) {
          return;
        }

        const manualPage = new PageClass();
        await manualPage.applyRules();
        const malId = await manualPage.getMalId();
        const episodeNumber = manualPage.getEpisodeNumber();

        if (malId === 0) {
          manualPage.openOverlay();
          return;
        }

        browser.runtime.sendMessage({
          type: 'initialise-skip-times',
          payload: { malId, episodeNumber, playerId },
        } as Message);
      })();
      break;
    }
    default:
    // no default
  }
};

browser.runtime.onMessage.addListener(messageHandler);
