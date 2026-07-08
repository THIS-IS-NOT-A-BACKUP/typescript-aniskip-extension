import browser from 'webextension-polyfill';
import { Message } from '../background';
import { PageFactory } from '../../pages/page-factory';

const globalWindow = window as typeof window & {
  __aniskipContentScriptInjected?: boolean;
};

if (!globalWindow.__aniskipContentScriptInjected) {
  globalWindow.__aniskipContentScriptInjected = true;

  const page = ((): ReturnType<typeof PageFactory.getPage> | null => {
    try {
      return PageFactory.getPage(window.location.href);
    } catch {
      return null;
    }
  })();

  /**
   * Injects the overlay.
   */
  const injectOverlayListener = (): void => {
    page?.injectOverlay();

    document.removeEventListener('DOMContentLoaded', injectOverlayListener);
  };

  // Inject search overlay once when the document body loads.
  if (page) {
    document.addEventListener('DOMContentLoaded', injectOverlayListener);
  }

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
          if (!page) {
            return;
          }

          await page.applyRules();
          const malId = await page.getMalId();
          const providerName = page.getProviderName();
          const episodeNumber = page.getEpisodeNumber();

          browser.runtime.sendMessage({
            payload:
              malId === 0
                ? { error: 'MAL id not found' }
                : { malId, providerName, episodeNumber },
            uuid: message.uuid,
          } as Message);

          if (malId === 0) {
            page.openOverlay();
          }
        })();
        break;
      }
      default:
      // no default
    }
  };

  browser.runtime.onMessage.addListener(messageHandler);
}
