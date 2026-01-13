import { DetailedHTMLProps, InputHTMLAttributes, forwardRef } from "react";
import classNames from "classnames";

interface InputFieldProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label: string;
  error?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, className, id, ...rest }, ref) => {
    const inputId = id ?? rest.name;

    return (
      <div className="space-y-2">
        <label
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground"
          htmlFor={inputId}
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={classNames(
            "flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all focus:border-primary/50",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          {...rest}
        />
        {error && <p className="text-sm font-medium text-destructive animate-fade-in-up">{error}</p>}
      </div>
    );
  }
);

InputField.displayName = "InputField";
