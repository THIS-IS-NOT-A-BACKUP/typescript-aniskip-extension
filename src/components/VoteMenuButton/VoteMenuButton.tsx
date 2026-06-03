import React from 'react';
import { FaListAlt } from 'react-icons/fa';
import { VoteMenuButtonProps } from './VoteMenuButton.types';
import {
  submitMenuVisibilityUpdated,
  voteMenuVisibilityUpdated,
  selectIsVoteMenuVisible,
} from '../../data';
import { getDomainName, useDispatch, useSelector } from '../../utils';
import { PlayerButton } from '../PlayerButton';

// Wrapped with React.forwardRef to pass Headless UI's transition refs down
export const VoteMenuButton = React.forwardRef<HTMLButtonElement, VoteMenuButtonProps>(
  ({ className = '', variant, ...props }, ref) => {
    const domainName = getDomainName(window.location.hostname);
    const isActive = useSelector(selectIsVoteMenuVisible);
    const dispatch = useDispatch();

    /**
     * Toggles the vote menu.
     */
    const onClick = (): void => {
      dispatch(voteMenuVisibilityUpdated(!isActive));
      dispatch(submitMenuVisibilityUpdated(false));
    };

    return (
      <PlayerButton
        ref={ref} // Pass the ref downward
        className={`vote-menu-button--${variant} vote-menu-button--${domainName} ${
          isActive ? 'active' : ''
        }  ${className}`}
        title="Vote skip times"
        onClick={onClick}
        {...props} // Forward any remaining injected animation props
      >
        <FaListAlt className="text-slate-100 w-1/2 h-full" />
      </PlayerButton>
    );
  }
);

VoteMenuButton.displayName = 'VoteMenuButton';