import { type ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "default" | "outline" | "secondary" | "ghost";
type Size = "default" | "lg" | "sm";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  default: "bg-[#2d7a3a] text-white hover:bg-[#246130] shadow-sm",
  outline: "border border-[#d4e4d4] bg-transparent hover:bg-[#eef4ee] text-[#1a2e1a]",
  secondary: "bg-white text-[#2d7a3a] hover:bg-[#f0f7f0] shadow-sm",
  ghost: "bg-transparent hover:bg-[#eef4ee] text-[#1a2e1a]",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  default: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "default", size = "default", className = "", ...props }, ref) => (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-smooth cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    />
  )
);
Button.displayName = "Button";
