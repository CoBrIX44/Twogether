import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'dashed';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-surface rounded-card p-5 sm:p-6 transition-all border border-pink/20',
          variant === 'default' && 'shadow-subtle',
          variant === 'elevated' && 'shadow-booth hover:shadow-booth-hover',
          variant === 'dashed' && 'border-2 border-dashed border-pink/40 bg-surface/80',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
