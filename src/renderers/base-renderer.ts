import { Renderer } from './base-renderer.types';

export abstract class BaseRenderer implements Renderer {
  id: string;

  reactRootId: string;

  shadowRoot: ShadowRoot;

  shadowRootContainer: HTMLDivElement;

  constructor(id: string, stopPropagationEvents: string[] = []) {
    this.id = id;
    this.reactRootId = `${id}-root`;
    this.shadowRootContainer = document.createElement('div');
    this.shadowRootContainer.setAttribute('id', this.id);
    this.shadowRoot = this.createShadowRoot(
      this.shadowRootContainer,
      stopPropagationEvents
    );
  }

  abstract render(): void;

  /**
   * Creates a shadow root initialised with the tailwindcss stylesheet.
   *
   * @param container Container element to add shadow root to.
   * @param stopPropagationEvents Events to stop propagation of.
   */
  createShadowRoot(
    container: HTMLDivElement,
    stopPropagationEvents: string[] = []
  ): ShadowRoot {
    const shadowRoot = container.attachShadow({
      mode: 'closed',
    });

    stopPropagationEvents.forEach((eventName) => {
      container.addEventListener(eventName, (event) => {
        event.stopPropagation();
      });
    });

    // Inject styles using inline webpack loaders.
    const tailwindcssStyle = document.createElement('style');
    // eslint-disable-next-line import/no-webpack-loader-syntax, global-require
    tailwindcssStyle.textContent = require(`!to-string-loader!css-loader?{"esModule":false,"sourceMap":false}!postcss-loader?{"postcssOptions":{"plugins":["postcss-import","tailwindcss","autoprefixer"]},"sourceMap":false}!tailwindcss/tailwind.css`);
    shadowRoot.appendChild(tailwindcssStyle);

    const playerScriptStyle = document.createElement('style');
    // eslint-disable-next-line import/no-webpack-loader-syntax, global-require
    playerScriptStyle.textContent = require('!to-string-loader!css-loader?{"esModule":false,"sourceMap":false}!sass-loader!../scripts/player/styles.scss');
    shadowRoot.appendChild(playerScriptStyle);

    const reactRoot = document.createElement('div');
    reactRoot.setAttribute('id', this.reactRootId);
    shadowRoot.appendChild(reactRoot);

    return shadowRoot;
  }
}
