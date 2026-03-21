"use client";

import clsx from "clsx";
import type { ChangeEvent, KeyboardEvent } from "react";
import { FiSearch } from "react-icons/fi";

type SearchBarProps = {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onClick?: () => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  dir?: "rtl" | "ltr";
  className?: string;
};

const SHADOW = "0 18px 45px rgba(17, 104, 114, 0.12)";

export default function SearchBar({
  value,
  onChange,
  onClick,
  onKeyDown,
  placeholder = "Search...",
  dir = "ltr",
  className,
}: SearchBarProps) {
  const isRTL = dir === "rtl";

  return (
    <div
      dir={dir}
      className={clsx("group relative w-full max-w-130", className)}
      style={{
        borderRadius: 9999,
        background:
          "color-mix(in srgb, var(--surface) 90%, var(--primary-soft) 10%)",
        boxShadow: SHADOW,
        border: "1px solid var(--border-color)",
      }}
    >
      <button
        type="button"
        onClick={onClick}
        aria-label="Search"
        className={clsx(
          "absolute top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-(--control-bg) text-(--primary-strong) transition group-focus-within:scale-105 hover:bg-(--primary-soft)",
          isRTL ? "left-2.5" : "right-2.5"
        )}
      >
        <FiSearch />
      </button>

      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className={clsx(
          "h-11 w-full rounded-full bg-transparent text-[14px] outline-none md:text-[15px]",
          "placeholder:text-(--muted-text) text-(--foreground)",
          "caret-(--primary)",
          isRTL ? "pl-11 pr-4 text-right" : "pr-11 pl-4 text-left"
        )}
        aria-label="Search input"
      />
    </div>
  );
}
