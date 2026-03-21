"use client";

import clsx from "clsx";
import Link from "next/link";
import type { Key, ReactNode } from "react";
import { SlArrowLeft } from "react-icons/sl";
import ServerError from "../feedback/ServerError";
import Pagination from "./Pagination";
import SearchBar from "./SearchBar";

type PaginationProps = {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  setPageSize: (size: number) => void;
  isFetching?: boolean;
};

type DataTableProps<T> = {
  items: T[];
  isError?: boolean;
  gridColsClass: string;
  renderRow: (item: T, index: number) => ReactNode;
  onRowClick?: (item: T, index: number) => void;
  headers: ReactNode[];
  getRowKey?: (item: T, index: number) => Key;
  enableSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: () => void;
  pageHeading?: string;
  showBackArrow?: boolean;
  backHref?: string;
  emptyText?: string;
  className?: string;
  headerClassName?: string;
  rowWrapperClassName?: string;
  bodyClassName?: string;
  pagination?: PaginationProps;
  addLinkHref?: string;
  addLinkLabel?: string;
  searchPlaceholder?: string;
  headerActions?: ReactNode;
};

function DataTable<T>({
  items,
  isError,
  gridColsClass,
  renderRow,
  onRowClick,
  headers,
  getRowKey,
  enableSearch,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  pageHeading,
  showBackArrow,
  backHref = "/",
  emptyText = "No data",
  className,
  headerClassName,
  rowWrapperClassName,
  bodyClassName,
  pagination,
  addLinkHref,
  addLinkLabel,
  searchPlaceholder,
  headerActions,
}: DataTableProps<T>) {
  if (isError) return <ServerError />;

  const CARD_RADIUS = 16;
  const CARD_BG = "var(--surface)";
  const BORDER = "var(--border-color)";
  const HEAD_TEXT = "var(--muted-text)";

  const headerRowClassName = clsx(
    "grid w-full items-center justify-items-center gap-0",
    gridColsClass,
    headerClassName
  );

  const rowClassName = clsx(
    "grid w-full items-center justify-items-center gap-0",
    "px-4 md:px-6 py-4",
    "text-sm md:text-base font-medium text-[color:var(--foreground)] text-center",
    "border-b border-(--border-color) last:border-b-0",
    "hover:bg-[color:var(--surface-muted)] transition-colors duration-150",
    onRowClick && "cursor-pointer",
    gridColsClass,
    rowWrapperClassName
  );

  return (
    <section className={clsx("flex flex-col gap-4", className)}>
      {(pageHeading || addLinkLabel || headerActions) && (
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {showBackArrow && (
              <Link
                href={backHref}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-(--border-color) bg-(--surface) transition-colors hover:bg-(--primary-soft)"
                aria-label="Back"
              >
                <SlArrowLeft className="text-[15px] text-(--foreground)" />
              </Link>
            )}
            {pageHeading && (
              <h2 className="text-xl font-semibold text-(--foreground)">
                {pageHeading}
              </h2>
            )}
          </div>

          {(addLinkLabel && addLinkHref) || headerActions ? (
            <div className="flex flex-wrap items-center gap-3">
              {headerActions}
              {addLinkLabel && addLinkHref ? (
                <Link
                  href={addLinkHref}
                  className="inline-flex h-10 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--primary),var(--primary-strong))] px-6 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(26,149,164,0.24)] transition hover:opacity-95"
                >
                  {addLinkLabel}
                </Link>
              ) : null}
            </div>
          ) : null}
        </header>
      )}

      <div
        className="relative overflow-hidden"
        style={{
          background: CARD_BG,
          borderRadius: CARD_RADIUS,
          border: `1px solid ${BORDER}`,
          boxShadow: "0 26px 60px rgba(11, 86, 95, 0.12)",
        }}
      >
        {enableSearch && (
          <div
            className="px-3 md:px-5 pt-4 pb-3 border-b"
            style={{
              borderColor: BORDER,
              background: `color-mix(in srgb, ${CARD_BG} 88%, var(--primary-soft) 12%)`,
            }}
          >
            <SearchBar
              value={searchValue ?? ""}
              onChange={(e) => onSearchChange?.(e.target.value)}
              onClick={() => onSearchSubmit?.()}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onSearchSubmit?.();
                }
              }}
              placeholder={searchPlaceholder ?? "Search"}
            />
          </div>
        )}

        {/* Table shell */}
        <div
          className={clsx("w-full overflow-x-auto scrollbar-soft", bodyClassName)}
        >
          <div className="w-max min-w-full px-2 py-0 md:px-4">
            {headers.length > 0 && (
              <div
                className={headerRowClassName}
                role="row"
                style={{
                  color: HEAD_TEXT,
                  borderBottom: `1px solid ${BORDER}`,
                }}
              >
                {headers.map((header, i) => (
                  <div
                    key={`header-${i}`}
                    className={clsx(
                      "px-4 py-4 w-full text-center font-semibold",
                      "text-base text-(--muted-text)"
                    )}
                    role="columnheader"
                  >
                    {header}
                  </div>
                ))}
              </div>
            )}

            {items.length === 0 ? (
              <div className="py-10 text-center text-(--muted-text)">
                <div
                  className="mx-auto max-w-xl rounded-[10px] border border-dashed px-6 py-8 text-sm"
                  style={{
                    borderColor: BORDER,
                    background:
                      "color-mix(in srgb, var(--surface) 82%, var(--primary-soft) 18%)",
                  }}
                >
                  {emptyText}
                </div>
              </div>
            ) : (
              <div>
                {items.map((item, index) => {
                  const key = getRowKey?.(item, index) ?? index;
                  return (
                    <div
                      key={key}
                      className={rowClassName}
                      role="row"
                      onClick={onRowClick ? () => onRowClick(item, index) : undefined}
                    >
                      {renderRow(item, index)}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {pagination && (
        <div className="mt-2">
          <Pagination
            page={pagination.page}
            setPage={pagination.setPage}
            totalPages={pagination.totalPages}
            totalCount={pagination.totalCount}
            pageSize={pagination.pageSize}
            setPageSize={pagination.setPageSize}
            isFetching={pagination.isFetching}
          />
        </div>
      )}
    </section>
  );
}

export default DataTable;
