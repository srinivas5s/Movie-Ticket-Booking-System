import React from 'react';
import { cn } from '../../utils/cn';
import { Spinner } from './Spinner';

export const Button = React.forwardRef(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.99]';

    const variants = {
      primary:
        'bg-white text-black font-semibold hover:bg-neutral-200 active:bg-neutral-300 shadow-glow-subtle',
      secondary:
        'bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/10 backdrop-blur-md',
      outline:
        'border border-white/20 text-white hover:bg-white/5 hover:border-white/40',
      ghost:
        'text-zinc-400 hover:text-white hover:bg-white/5',
      danger:
        'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40',
      glow:
        'bg-white text-black font-semibold hover:bg-neutral-100 shadow-glow-white',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 gap-1.5',
      md: 'text-sm px-4 py-2.5 gap-2',
      lg: 'text-base px-6 py-3 gap-2.5',
      icon: 'p-2.5 aspect-square',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <Spinner size="sm" className={variant === 'primary' || variant === 'glow' ? 'border-t-black border-black/20' : ''} />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
