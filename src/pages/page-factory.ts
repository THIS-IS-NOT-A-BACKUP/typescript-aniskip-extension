import globToRegExp from 'glob-to-regexp';
import { Page } from './base-page.types';
import { Animepahe } from './animepahe';
import { Crunchyroll } from './crunchyroll';
import { CrunchyrollBeta } from './crunchyroll-beta';

export class PageFactory {
  static pages = [Animepahe, Crunchyroll, CrunchyrollBeta];

  /**
   * Obtains the page object from the domain.
   *
   * @param url Provider's host.
   */
  static getPage(url: string): Page {
    for (let i = 0; i < PageFactory.pages.length; i += 1) {
      const CurrentPage = PageFactory.pages[i];

      const metadata = CurrentPage.getMetadata();
      const { pageUrls } = metadata;

      for (let j = 0; j < pageUrls.length; j += 1) {
        const matcher = globToRegExp(pageUrls[j]);

        if (matcher.test(url)) {
          return new CurrentPage();
        }
      }
    }

    throw new Error(`Page ${url} not supported`);
  }
}
