import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline';
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = 'default', ...props }) => {
  const baseStyle = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  const variantStyles = {
    default: "border-transparent bg-cyan-500 text-gray-900",
    secondary: "bg-zinc-800 text-zinc-300 border-zinc-700",
    outline: "text-zinc-400 border-zinc-700"
  };

  return (
    <div className={`${baseStyle} ${variantStyles[variant]} ${className}`} {...props} />
  );
};
