import React from 'react';
import { FaPlayCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { PlayerButton } from '../PlayerButton';
import {
  submitMenuVisibilityUpdated,
  voteMenuVisibilityUpdated,
  selectIsSubmitMenuVisible,
} from '../../data';
import { getDomainName, useDispatch } from '../../utils';
import { SubmitMenuProps } from './SubmitMenuButton.types';

// Wrapped with React.forwardRef to pass transition properties down cleanly
export const SubmitMenuButton = React.forwardRef<HTMLButtonElement, SubmitMenuProps>(
  ({ variant, ...props }, ref): JSX.Element => {
    const domainName = getDomainName(window.location.hostname);
    const isActive = useSelector(selectIsSubmitMenuVisible);
    const dispatch = useDispatch();

    /**
     * Toggles the submit menu.
     */
    const onClick = (): void => {
      dispatch(submitMenuVisibilityUpdated(!isActive));
      dispatch(voteMenuVisibilityUpdated(false));
    };

    return (
      <PlayerButton
        ref={ref} // Pass the ref onward to PlayerButton
        className={`submit-menu-button--${variant} submit-menu-button--${domainName} ${
          isActive ? 'active' : ''
        }`}
        title="Submit skip times"
        onClick={onClick}
        {...props} // Forward animation attributes
      >
        <FaPlayCircle className="text-slate-100 w-1/2 h-full" />
      </PlayerButton>
    );
  }
);

SubmitMenuButton.displayName = 'SubmitMenuButton';