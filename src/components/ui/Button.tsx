import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'pill-lg';
  isPulse?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isPulse = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-display font-medium rounded-pill transition-all duration-200 focus-visible:outline-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none';

  const variants = {
    primary:
      'bg-pink-deep text-white shadow-booth hover:shadow-booth-hover hover:bg-[#e0538b]',
    secondary:
      'bg-surface text-ink border-2 border-pink/30 hover:border-pink-deep hover:bg-pink/10 shadow-subtle',
    outline:
      'border-2 border-muted/30 text-ink hover:border-pink-deep hover:text-pink-deep hover:bg-pink/5',
    ghost:
      'text-ink hover:bg-pink/15 hover:text-pink-deep',
    danger:
      'bg-danger text-white shadow-subtle hover:bg-red-600',
  };

  const sizes = {
    sm: 'text-xs sm:text-sm px-3.5 py-1.5 gap-1.5 min-h-[36px]',
    md: 'text-sm sm:text-base px-5 py-2.5 gap-2 min-h-[44px]',
    lg: 'text-base sm:text-lg px-6 py-3 gap-2.5 min-h-[50px]',
    'pill-lg': 'text-lg sm:text-xl px-8 py-3.5 gap-3 min-h-[56px] shadow-booth font-semibold',
  };

  return (
    <button
      className={twMerge(
        clsx(
          baseStyles,
          variants[variant],
          sizes[size],
          isPulse && 'animate-pulse-ring',
          className
        )
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </button>
  );
};
