import React, { forwardRef } from "react";
import Spinner from "./Spinner";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline" | "ghost";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className = "", variant = "primary", isLoading = false, type = "button", disabled = false, ...props }, ref) => {
    const baseStyle = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:pointer-events-none text-sm px-5 py-3 font-sans active:scale-[0.98]";
    
    const variants = {
      primary: "bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-500/20 border border-transparent focus:ring-offset-dark-950",
      secondary: "bg-dark-800 hover:bg-dark-750 text-dark-100 border border-dark-700/60 focus:ring-offset-dark-950",
      danger: "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/20 border border-transparent focus:ring-offset-dark-950",
      outline: "bg-transparent hover:bg-dark-800/40 text-dark-200 hover:text-white border border-dark-700/80 focus:ring-offset-dark-950",
      ghost: "bg-transparent hover:bg-dark-800/40 text-dark-300 hover:text-white border border-transparent focus:ring-offset-dark-950",
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={`${baseStyle} ${variants[variant]} ${className}`}
        {...props}
      >
        {isLoading && <Spinner className="mr-2 h-4 w-4 text-current" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
