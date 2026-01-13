import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import classNames from "classnames";

type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg";
  isLoading?: boolean;
};

export function Button({
  className,
  variant = "primary",
  size = "default",
  isLoading = false,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={classNames(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        // Size
        size === "default" && "h-10 px-4 py-2 text-sm",
        size === "sm" && "h-9 rounded-md px-3 text-xs",
        size === "lg" && "h-11 rounded-md px-8 text-base",
        // Variants
        variant === "primary" &&
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20",
        variant === "secondary" &&
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        variant === "outline" &&
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
         variant === "ghost" &&
          "hover:bg-accent hover:text-accent-foreground text-foreground/80",
        variant === "link" && 
            "text-primary underline-offset-4 hover:underline",
        (disabled || isLoading) && "opacity-50",
        className
      )}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <>
            <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            ></circle>
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
            </svg>
            Processing...
        </>
      ) : children}
    </button>
  );
}
