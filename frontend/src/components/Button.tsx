import React from 'react';

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {

  const baseStyles =
    'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none w-full';

  const variants = {
    primary:
      'bg-blue-600 text-white hover:bg-blue-700 shadow-md',

    secondary:
      'bg-gray-200 text-black hover:bg-gray-300',

    outline:
      'border border-gray-300 bg-white hover:bg-gray-100',

    ghost:
      'hover:bg-gray-100',

    destructive:
      'bg-red-600 text-white hover:bg-red-700',
  };

  const sizes = {
    sm: 'h-10 px-4 text-sm',
    md: 'h-12 px-6 text-base',
    lg: 'h-14 px-8 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}