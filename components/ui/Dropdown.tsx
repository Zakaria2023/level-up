"use client";

import FormError from "@/components/feedback/FormError";
import clsx from "clsx";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { FiChevronDown, FiSearch } from "react-icons/fi";

export interface DropdownOption {
  label: string;
  value: string;
  icon?: ReactNode;
}

interface DropdownProps {
  label: string;
  value?: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  labelClassName?: string;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyStateText?: string;
  disabled?: boolean;
}

export default function Dropdown({
  label,
  value,
  options,
  onChange,
  placeholder = "Select",
  error,
  labelClassName,
  className,
  buttonClassName,
  menuClassName,
  searchable = false,
  searchPlaceholder = "Search...",
  emptyStateText = "No results found.",
  disabled = false,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value),
    [options, value]
  );

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return options;

    return options.filter((option) => {
      const optionLabel = option.label.toLowerCase();
      const optionValue = option.value.toLowerCase();

      return (
        optionLabel.includes(normalizedQuery) ||
        optionValue.includes(normalizedQuery)
      );
    });
  }, [options, query]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (open && searchable) {
      searchInputRef.current?.focus();
    }
  }, [open, searchable]);

  return (
    <div ref={containerRef} className={clsx("w-full", className)}>
      <label
        className={clsx(
          "mb-2 block text-[16px] font-medium text-[#0E6B7A]",
          labelClassName
        )}
      >
        {label}
      </label>

      <div className="relative">
        <button
          type="button"
          aria-expanded={open}
          disabled={disabled}
          onClick={() => {
            if (disabled) {
              return;
            }

            if (open) {
              setQuery("");
            }

            setOpen((prev) => !prev);
          }}
          className={clsx(
            "flex h-12 w-full items-center justify-between rounded-[14px] border bg-white px-4 text-left text-[14px] font-medium outline-none transition",
            error
              ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-4 focus:ring-[#EF4444]/10"
              : "border-[#C7D6E2] hover:border-[#B5CADA] focus:border-[#8E8E8E]",
            disabled && "cursor-not-allowed bg-[#F5F7FA] opacity-70",
            buttonClassName
          )}
        >
          <span
            className={clsx(
              "flex min-w-0 items-center gap-2",
              selectedOption ? "text-[#0B1220]" : "text-[#99A8B8]"
            )}
          >
            {selectedOption?.icon}
            <span>
              {selectedOption?.label ?? placeholder}
            </span>
          </span>

          <FiChevronDown
            className={clsx(
              "shrink-0 text-[16px] text-[#6B7A8D] transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </button>

        {open ? (
          <div
            className={clsx(
              "absolute top-[calc(100%+8px)] z-30 w-full rounded-[18px] border border-[#DCEAF4] bg-white p-2 shadow-[0_20px_40px_rgba(15,23,42,0.10)]",
              menuClassName
            )}
          >
            {searchable ? (
              <div className="mb-2 border-b border-[#E6EEF5] pb-2">
                <div className="flex items-center gap-2 rounded-xl border border-[#D6E3ED] bg-[#F9FCFE] px-3">
                  <FiSearch className="shrink-0 text-[15px] text-[#7A8AA0]" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={searchPlaceholder}
                    className="h-10 w-full bg-transparent text-[14px] text-[#244E62] outline-none placeholder:text-[#99A8B8]"
                  />
                </div>
              </div>
            ) : null}

            <div className="max-h-56 overflow-y-auto">
              {filteredOptions.map((option) => {
                const active = option.value === value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                      setQuery("");
                    }}
                    className={clsx(
                      "flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-[14px] transition",
                      active
                        ? "bg-[#EAF7FF] font-semibold text-[#139FDA]"
                        : "text-[#244E62] hover:bg-[#F4FAFE]"
                    )}
                  >
                    {option.icon}
                    <span>{option.label}</span>
                  </button>
                );
              })}

              {!filteredOptions.length ? (
                <p className="px-3 py-2 text-[13px] font-medium text-[#8A99AA]">
                  {emptyStateText}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      <FormError>{error}</FormError>
    </div>
  );
}
