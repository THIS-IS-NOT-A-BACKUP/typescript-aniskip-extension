import isMobile from '../../utils/responsive_utils';
import BasePlayer from '../base_player';
import metadata from './metadata.json';

class Crunchyroll extends BasePlayer {
  constructor(document: Document) {
    super(document, metadata);
  }

  injectSkipButtons() {
    if (isMobile()) {
      const seekBarContainer = this.getSeekBarContainer();

      if (
        seekBarContainer &&
        !this.document.getElementById(this.skipButtonRenderer.id)
      ) {
        seekBarContainer.parentElement?.appendChild(
          this.skipButtonRenderer.shadowRootContainer
        );
      }

      return;
    }

    super.injectSkipButtons();
  }

  getSeekBarContainer() {
    if (isMobile()) {
      return super.getContainerHelper(
        metadata.seekBarContainerSelectorStringMobile
      );
    }

    return super.getContainerHelper(metadata.seekBarContainerSelectorString, 1);
  }

  initialise() {
    super.initialise();
    const controlsPackage = this.getVideoControlsContainer();
    if (controlsPackage) {
      new MutationObserver(async () => {
        this.injectSubmitMenuButton();
        this.injectSkipTimeIndicator();
        this.injectSkipButtons();
      }).observe(controlsPackage, { childList: true });
    }
  }
}

export default Crunchyroll;
