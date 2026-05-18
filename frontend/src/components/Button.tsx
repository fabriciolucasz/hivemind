import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg cursor-pointer w-full ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}