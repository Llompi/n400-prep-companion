import { type ButtonHTMLAttributes, type ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center font-medium transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-4 py-2.5 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-xl',
  };

  const variantStyles = {
    primary: `
      bg-primary text-white hover:bg-primary-hover
      dark:bg-primary-dark dark:hover:bg-primary-dark/90
      shadow-sm hover:shadow-md
    `,
    secondary: `
      bg-neutral-100 text-neutral-900 hover:bg-neutral-200
      dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700
    `,
    outline: `
      border border-neutral-200 bg-transparent text-neutral-900 hover:bg-neutral-50
      dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-800
    `,
    danger: `
      bg-red-500 text-white hover:bg-red-600
      dark:bg-red-600 dark:hover:bg-red-700
      shadow-sm hover:shadow-md
    `,
    ghost: `
      text-neutral-700 hover:bg-neutral-100
      dark:text-neutral-300 dark:hover:bg-neutral-800
    `,
  };

  const combinedClassName = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
}

export default Button;
