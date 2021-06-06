import React from 'react';
import useFullscreenState from '../../hooks/use_fullscreen_state';
import useMobileState from '../../hooks/use_mobile_state';
import { SkipButtonProps } from '../../types/components/skip_time_button_types';
import { getDomainName } from '../../utils/string_utils';
import DefaultButton from '../Button';

const Button = ({ skipType, variant, hidden, onClick }: SkipButtonProps) => {
  const { isFullscreen } = useFullscreenState();
  const { isMobile } = useMobileState();

  const skipTypeFullNames = {
    op: 'Opening',
    ed: 'Ending',
    preview: 'Preview',
  };

  const domainName = getDomainName(window.location.hostname);

  return (
    <div
      className={`absolute right-11 bottom-16 z-10 pointer-events-none skip-button--${variant} skip-button--${domainName} ${
        isFullscreen
          ? `skip-button--${variant}--fullscreen skip-button--${domainName}--fullscreen`
          : ''
      } ${
        isMobile
          ? `skip-button--mobile skip-button--${variant}--mobile skip-button--${domainName}--mobile`
          : ''
      }`}
    >
      <DefaultButton
        className={`transition-opacity font-sans whitespace-nowrap text-white bg-trueGray-800 bg-opacity-80 py-3 border border-gray-300 font-bold uppercase ${
          hidden ? 'opacity-0 pointer-events-none' : 'pointer-events-auto '
        }`}
        onClick={onClick}
      >
        {`Skip ${skipTypeFullNames[skipType]}`}
      </DefaultButton>
    </div>
  );
};
export default Button;
