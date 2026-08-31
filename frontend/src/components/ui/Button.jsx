import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = React.forwardRef(({ className = '', variant = 'primary', size = 'default', isLoading = false, children, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer";
  
  const variants = {
    primary: "bg-[#6c5ce7] text-white hover:bg-[#5a4bd1] focus-visible:ring-[#6c5ce7] shadow-[0_1px_2px_rgba(0,0,0,0.05),0_4px_12px_rgba(108,92,231,0.25)] hover:shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_24px_rgba(108,92,231,0.35)] active:scale-[0.98]",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    outline: "border-2 border-gray-200 bg-white hover:bg-gray-50 text-gray-700 hover:border-gray-300",
    ghost: "hover:bg-gray-100 text-gray-600",
  };

  const sizes = {
    default: "h-11 px-5 py-2.5",
    sm: "h-9 px-4 text-xs",
    lg: "h-12 px-8 text-base",
    icon: "h-10 w-10",
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button ref={ref} className={classes} disabled={isLoading || props.disabled} {...props}>
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
});

Button.displayName = "Button";

export { Button };
