import { getDomainName } from '../../utils';
import { BasePage } from '../base-page';
import { Metadata } from '../base-page.types';
import metadata from './metadata.json';

export class AnimeOnsen extends BasePage {
  constructor() {
    super();
    this.providerName = getDomainName(window.location.hostname);
  }

  static getMetadata(): Metadata {
    return metadata as unknown as Metadata;
  }

  getTitle(): string {
    const el = document.querySelector('.ao-player-metadata-title');

    return el
      ? (el as HTMLElement).innerText.replace(/\s*\(TV\)\s*$/i, '').trim()
      : '';
  }

  getIdentifier(): string {
    const malUrl = document
      .querySelector('meta[name="ao-content-mal-url"]')
      ?.getAttribute('content');

    if (!malUrl) {
      return '';
    }

    const match = malUrl.match(/anime\/(\d+)/);

    return match ? match[1] : '';
  }

  getRawEpisodeNumber(): number {
    const episode = document
      .querySelector('meta[name="ao-content-episode"]')
      ?.getAttribute('content');

    return episode ? parseFloat(episode) : 0;
  }

  async getMalId(): Promise<number> {
    const malUrl = document
      .querySelector('meta[name="ao-content-mal-url"]')
      ?.getAttribute('content');

    const match = malUrl?.match(/anime\/(\d+)/);

    return match ? parseInt(match[1], 10) : 0;
  }
}