import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, type = "text", ...props }, ref) => {
    return (
      <div className="w-full flex flex-col space-y-1.5">
        {label && (
          <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-dark-450">
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          type={type}
          className={`glass-input w-full ${
            error ? "border-red-500/60 focus:border-red-500 focus:ring-red-500" : ""
          } ${className}`}
          {...props}
        />
        {error && (
          <span className="text-xs text-red-450 font-medium mt-0.5">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
