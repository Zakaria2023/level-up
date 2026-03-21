"use client";

import clsx from "clsx";
import { forwardRef, ReactNode } from "react";
import FormError from "../feedback/FormError";

interface Props {
  label: string;
  requiredMark?: boolean;
  placeholder?: string;
  error?: string;
  inputType: "text" | "password" | "email" | "number" | "tel" | "date" | "time";
  rightSide?: ReactNode;
  labelClassName?: string;
  as?: "input" | "textarea";
  rows?: number;
}

type InputProps =
  | (Props & React.InputHTMLAttributes<HTMLInputElement> & { as?: "input" })
  | (Props &
    React.TextareaHTMLAttributes<HTMLTextAreaElement> & { as: "textarea" });

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  (
    {
      label,
      requiredMark = false,
      placeholder,
      error,
      rightSide,
      inputType,
      className,
      labelClassName,
      as = "input",
      rows = 4,
      ...props
    },
    ref
  ) => {
    const labelClasses = clsx(
      "mb-2 text-[16px] font-medium text-[#0E6B7A]",
      labelClassName
    );

    const fieldClasses = clsx(
      "mt-1 bg-white w-full h-12 rounded-[12px] border border-[#B8C9D8] px-4 text-[15px] text-[#0B1220] placeholder:text-[14px] placeholder:text-[#B0BBC6]",
      "px-10 text-lg font-medium",
      "outline-none transition",
      error
        ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-4 focus:ring-[#EF4444]/10"
        : "border-[#8E8E8E] focus:border-[#8E8E8E] focus:ring-0",
      rightSide ? "pr-16" : "",
      className
    );

    return (
      <div className="w-full">
        <label className={labelClasses}>
          {label}
          {requiredMark ? <span className="ml-2 text-[#EF4444]">*</span> : null}
        </label>

        <div className="relative">
          {as === "textarea" ? (
            <textarea
              ref={ref as React.Ref<HTMLTextAreaElement>}
              rows={rows}
              placeholder={placeholder}
              aria-invalid={!!error}
              className={clsx(
                "min-h-40 resize-y mt-1",
                "w-full rounded-[26px] border bg-white px-10 py-6 text-[22px] font-medium text-[#0B1220]",
                "placeholder:text-[#B7BDC6] outline-none transition",
                error
                  ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-4 focus:ring-[#EF4444]/10"
                  : "border-[#8E8E8E] focus:border-[#8E8E8E] focus:ring-0",
                rightSide ? "pr-16" : "",
                className
              )}
              {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          ) : (
            <input
              ref={ref as React.Ref<HTMLInputElement>}
              type={inputType}
              placeholder={placeholder}
              aria-invalid={!!error}
              className={fieldClasses}
              {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
            />
          )}

          {rightSide ? (
            <div className="absolute inset-y-0 right-6 flex items-center">
              {rightSide}
            </div>
          ) : null}
        </div>

        <FormError>{error}</FormError>
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
