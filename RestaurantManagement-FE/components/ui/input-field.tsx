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
      <label
        className="flex w-full flex-col gap-2 text-sm text-slate-200"
        htmlFor={inputId}
      >
        <span className="font-medium text-slate-100">{label}</span>
        <input
          ref={ref}
          id={inputId}
          className={classNames("w-full", className)}
          {...rest}
        />
        {error && <span className="text-xs text-red-400">{error}</span>}
      </label>
    );
  }
);

InputField.displayName = "InputField";
