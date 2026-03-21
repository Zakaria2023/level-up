"use client";

import useCurrentLang from "@/hooks/useCurrentLang";
import { useMemo, type CSSProperties } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface PaginationProps {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  totalCount?: number;
  pageSize: number;
  setPageSize: (size: number) => void;
  isFetching?: boolean;
}

const TOKENS = {
  activeBg: "linear-gradient(135deg, var(--primary), var(--primary-strong))",
  activeText: "#ffffff",
  activeShadow: "0 12px 24px rgba(26, 149, 164, 0.22)",
  inactiveBg: "var(--surface)",
  inactiveText: "var(--muted-text)",
  inactiveBorder: "var(--border-color)",
  arrowBg: "var(--surface)",
  arrowColor: "var(--foreground)",
} as const;

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

function Pagination({
  page,
  setPage,
  totalPages,
  isFetching = false,
}: PaginationProps) {
  const lang = useCurrentLang()

  const { pages, showStartEllipsis, showEndEllipsis } = useMemo(() => {
    const windowSize = 5;
    const current = page + 1;
    const start = clamp(
      current - Math.floor(windowSize / 2),
      1,
      Math.max(1, totalPages - windowSize + 1)
    );
    const end = Math.min(totalPages, start + windowSize - 1);
    const range = Array.from({ length: end - start + 1 }, (_, index) =>
      start + index
    );

    return {
      pages: range,
      showStartEllipsis: start > 2,
      showEndEllipsis: end < totalPages - 1,
    };
  }, [page, totalPages]);

  const atFirst = page <= 0;
  const atLast = page >= Math.max(0, totalPages - 1);

  const numChipBase =
    "inline-flex h-8 min-w-8 items-center justify-center rounded-full border text-sm font-semibold transition";
  const numActive: CSSProperties = {
    background: TOKENS.activeBg,
    color: TOKENS.activeText,
    borderColor: "transparent",
    boxShadow: TOKENS.activeShadow,
  };
  const numInactive: CSSProperties = {
    background: TOKENS.inactiveBg,
    color: TOKENS.inactiveText,
    borderColor: TOKENS.inactiveBorder,
  };

  const arrowChipBase =
    "inline-flex h-8 w-8 items-center justify-center rounded-full border text-sm transition hover:bg-(--primary-soft) hover:text-[color:var(--primary-strong)]";
  const arrowStyle: CSSProperties = {
    background: TOKENS.arrowBg,
    color: TOKENS.arrowColor,
    borderColor: TOKENS.inactiveBorder,
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 px-1 pt-2">
        <button
          type="button"
          aria-label="Previous page"
          disabled={atFirst || isFetching}
          onClick={() => setPage(page - 1)}
          className={`${arrowChipBase} ${atFirst || isFetching ? "cursor-not-allowed opacity-40" : ""
            }`}
          style={arrowStyle}
        >
          {lang === "ar" ? <FiChevronRight /> : <FiChevronLeft />}
        </button>

        {totalPages > 0 && (
          <button
            type="button"
            aria-label="Page 1"
            aria-current={page === 0 ? "page" : undefined}
            onClick={() => setPage(0)}
            disabled={isFetching}
            className={numChipBase}
            style={page === 0 ? numActive : numInactive}
          >
            1
          </button>
        )}

        {showStartEllipsis && (
          <span className="select-none px-1 text-sm text-(--muted-text)">
            ...
          </span>
        )}

        {pages.map((currentPage) => {
          if (currentPage === 1 || currentPage === totalPages) return null;

          const zeroBasedPage = currentPage - 1;
          const isActive = zeroBasedPage === page;

          return (
            <button
              key={currentPage}
              type="button"
              aria-label={`Page ${currentPage}`}
              aria-current={isActive ? "page" : undefined}
              onClick={() => setPage(zeroBasedPage)}
              disabled={isFetching}
              className={numChipBase}
              style={isActive ? numActive : numInactive}
            >
              {currentPage}
            </button>
          );
        })}

        {showEndEllipsis && (
          <span className="select-none px-1 text-sm text-(--muted-text)">
            ...
          </span>
        )}

        {totalPages > 1 && (
          <button
            type="button"
            aria-label={`Page ${totalPages}`}
            aria-current={page === totalPages - 1 ? "page" : undefined}
            onClick={() => setPage(totalPages - 1)}
            disabled={isFetching}
            className={numChipBase}
            style={page === totalPages - 1 ? numActive : numInactive}
          >
            {totalPages}
          </button>
        )}

        <button
          type="button"
          aria-label="Next page"
          disabled={atLast || isFetching}
          onClick={() => setPage(page + 1)}
          className={`${arrowChipBase} ${atLast || isFetching ? "cursor-not-allowed opacity-40" : ""
            }`}
          style={arrowStyle}
        >
          {lang === "ar" ? <FiChevronLeft /> : <FiChevronRight />}
        </button>
      </div>
    </div>
  );
}

export default Pagination;
