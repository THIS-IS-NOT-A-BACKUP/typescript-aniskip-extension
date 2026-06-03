import { Page } from '../pages/base-page.types';
import { PageFactory } from '../pages/page-factory';

export type PageInfo = {
  id: string;
  label: string;
};

/**
 * Gets a list of all available pages with their metadata.
 */
export function getAvailablePages(): PageInfo[] {
  return PageFactory.pages.map((PageClass, index) => {
    // Create a temporary instance to get provider name
    const tempInstance = new PageClass();
    const providerName =
      tempInstance.constructor.name
        .replace(/([A-Z])/g, ' $1')
        .trim()
        .replace(/  +/g, ' ') || 'Unknown';

    return {
      id: `page-${index}`,
      label: providerName,
    };
  });
}

/**
 * Gets a page class by its id.
 *
 * @param pageId The page id (e.g., 'page-0').
 */
export function getPageById(pageId: string): (new () => Page) | null {
  const index = parseInt(pageId.replace('page-', ''), 10);
  if (Number.isNaN(index) || index < 0 || index >= PageFactory.pages.length) {
    return null;
  }

  return PageFactory.pages[index];
}
