import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import classNames from "classnames";

type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  variant?: "primary" | "ghost";
  isLoading?: boolean;
};

export function Button({
  className,
  variant = "primary",
  isLoading = false,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={classNames(
        "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium",
        variant === "primary" &&
          "bg-primary text-primary-foreground hover:bg-blue-500",
        variant === "ghost" &&
          "border border-slate-700 bg-transparent text-slate-200 hover:bg-slate-800",
        (disabled || isLoading) && "cursor-not-allowed opacity-60",
        className
      )}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? "Please wait…" : children}
    </button>
  );
}
