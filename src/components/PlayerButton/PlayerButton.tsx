import React, { useEffect, useRef, useState } from 'react';
import { Tooltip } from '../Tooltip';
import { PlayerButtonProps } from './PlayerButton.types';

// Wrapped with React.forwardRef to allow parent libraries to read the underlying HTML button
export const PlayerButton = React.forwardRef<HTMLButtonElement, PlayerButtonProps>(
  (
    {
      className = '',
      children,
      title,
      onMouseEnter: onMouseEnterProps,
      onMouseLeave: onMouseLeaveProps,
      onClick: onClickProps,
      ...props
    },
    ref
  ): JSX.Element => {
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [isActivatedOnce, setIsActivatedOnce] = useState<boolean>(false);
    const [isMouseMoved, setIsMouseMoved] = useState<boolean>(false);
    const mouseMovedTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

    /**
     * Handles on mouse enter event.
     *
     * @param event Mouse event object.
     */
    const onMouseEnter = (event: React.MouseEvent<HTMLButtonElement>): void => {
      setIsHovered(true);

      if (!onMouseEnterProps) {
        return;
      }

      onMouseEnterProps(event);
    };

    /**
     * Handles on mouse leave event.
     *
     * @param event Mouse event object.
     */
    const onMouseLeave = (event: React.MouseEvent<HTMLButtonElement>): void => {
      setIsActivatedOnce(false);
      setIsHovered(false);

      if (!onMouseLeaveProps) {
        return;
      }

      onMouseLeaveProps(event);
    };

    /**
     * Resets mouse moved timer.
     */
    const onMouseMove = (): void => {
      if (mouseMovedTimeoutRef.current) {
        clearTimeout(mouseMovedTimeoutRef.current);
      }

      setIsMouseMoved(true);

      mouseMovedTimeoutRef.current = setTimeout(
        () => setIsMouseMoved(false),
        500
      );
    };

    /**
     * Handles on mouse click event.
     *
     * @param event Mouse event object.
     */
    const onClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
      setIsActivatedOnce(true);

      if (!onClickProps) {
        return;
      }

      onClickProps(event);
    };

    /**
     * Remove mouse moved timeout on component unmount.
     */
    useEffect(
      (): (() => void) => () => {
        if (mouseMovedTimeoutRef.current) {
          clearTimeout(mouseMovedTimeoutRef.current);
        }
      },
      []
    );

    return (
      <div className="flex flex-col relative items-center font-sans">
        {title && (
          <Tooltip isVisible={isHovered && !isActivatedOnce && !isMouseMoved}>
            {title}
          </Tooltip>
        )}
        <button
          ref={ref} // <--- Pass the ref to the literal DOM button element here
          className={`w-8 h-8 cursor-pointer select-none outline-none flex items-center justify-center transition-colors ${className}`}
          type="button"
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onMouseMove={onMouseMove}
          {...props}
        >
          {children}
        </button>
      </div>
    );
  }
);

PlayerButton.displayName = 'PlayerButton';