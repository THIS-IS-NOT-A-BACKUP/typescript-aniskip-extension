import React from 'react';
import { InputProps } from './Input.types';

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className = '', ...props }: InputProps,
    ref: React.ForwardedRef<HTMLInputElement>
  ): JSX.Element => (
    <input
      className={`rounded px-3 py-2 block min-w-0 border border-gray-300 focus:outline-none ${className}`}
      ref={ref}
      type="text"
      autoComplete="off"
      {...props}
    />
  )
);

Input.displayName = 'Input';
