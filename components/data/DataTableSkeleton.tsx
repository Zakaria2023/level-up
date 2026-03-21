"use client";

import clsx from "clsx";
import type { ReactNode } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

type Props = {
  gridColsClass: string;
  headers: ReactNode[];
  rowCount?: number;
  className?: string;
  bodyClassName?: string;
  minColWidth?: number;
  showHeaderBar?: boolean;
  enableSearch?: boolean;
  showPaginationSkeleton?: boolean;
};

const CARD_RADIUS = 10;
const CARD_BG = "var(--surface)";
const BORDER = "var(--border-color)";
const TXT_MID = "var(--muted-text)";
const SKEL_BASE = "var(--surface-muted)";
const SKEL_HI = "var(--surface)";

const DataTableSkeleton = ({
  gridColsClass,
  headers,
  rowCount = 8,
  className,
  bodyClassName,
  minColWidth = 160,
  showHeaderBar = true,
  enableSearch = false,
  showPaginationSkeleton = true,
}: Props) => {
  const headerCount = headers.length;
  const minWidth = Math.max(960, headerCount * minColWidth);
  const colCount = headerCount || 4;

  const primaryW = ["55%", "50%", "60%", "45%", "65%", "55%", "48%"];
  const subW = ["30%", "40%", "50%", "35%", "25%", "38%", "28%"];

  return (
    <section className={clsx("flex flex-col gap-4", className)}>
      {showHeaderBar && (
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Skeleton
              width={36}
              height={36}
              baseColor={SKEL_BASE}
              highlightColor={SKEL_HI}
              borderRadius={8}
            />
            <Skeleton
              width={180}
              height={22}
              baseColor={SKEL_BASE}
              highlightColor={SKEL_HI}
              borderRadius={6}
            />
          </div>

          <Skeleton
            width={140}
            height={36}
            baseColor={SKEL_BASE}
            highlightColor={SKEL_HI}
            borderRadius={999}
          />
        </header>
      )}

      <div
        className="relative overflow-hidden shadow-[0_26px_60px_rgba(11,86,95,0.12)]"
        style={{
          background: CARD_BG,
          borderRadius: CARD_RADIUS,
          border: `1px solid ${BORDER}`,
        }}
      >
        {enableSearch && (
          <div
            className="border-b px-3 pt-4 pb-3 md:px-5"
            style={{
              borderColor: BORDER,
              background:
                "color-mix(in srgb, var(--surface) 88%, var(--primary-soft) 12%)",
            }}
          >
            <div className="flex items-center gap-3">
              <Skeleton
                width="100%"
                height={40}
                baseColor={SKEL_BASE}
                highlightColor={SKEL_HI}
                borderRadius={999}
              />
            </div>
          </div>
        )}

        <div className={clsx("w-full overflow-x-auto scrollbar-soft", bodyClassName)}>
          <div className="px-2 py-0 md:px-4" style={{ minWidth }}>
            {headerCount > 0 && (
              <div
                className={clsx(
                  "grid w-full items-center justify-items-center gap-0",
                  gridColsClass
                )}
                role="row"
                style={{ borderBottom: `1px solid ${BORDER}` }}
              >
                {headers.map((_, index) => (
                  <div
                    key={`h-${index}`}
                    className="flex w-full items-center justify-center px-4 py-4"
                  >
                    <Skeleton
                      width="35%"
                      height={14}
                      baseColor={SKEL_BASE}
                      highlightColor={SKEL_HI}
                      borderRadius={6}
                      style={{ display: "inline-block" }}
                    />
                  </div>
                ))}
              </div>
            )}

            <div>
              {Array.from({ length: rowCount }).map((_, rowIndex) => (
                <div
                  key={`r-${rowIndex}`}
                  className={clsx(
                    "grid w-full items-center justify-items-center gap-0",
                    "border-b border-(--border-color) px-4 py-4 md:px-6",
                    gridColsClass
                  )}
                  role="row"
                >
                  {Array.from({ length: colCount }).map((_, columnIndex) => {
                    const isLast = columnIndex === colCount - 1;
                    const primaryWidth = primaryW[columnIndex % primaryW.length];
                    const secondaryWidth = subW[columnIndex % subW.length];

                    return (
                      <div
                        key={`c-${rowIndex}-${columnIndex}`}
                        className={clsx(
                          "flex w-full items-center",
                          isLast ? "justify-center" : "justify-start"
                        )}
                      >
                        {isLast ? (
                          <div className="flex items-center gap-3">
                            <Skeleton
                              width={28}
                              height={28}
                              baseColor={SKEL_BASE}
                              highlightColor={SKEL_HI}
                              borderRadius={8}
                            />
                            <Skeleton
                              width={28}
                              height={28}
                              baseColor={SKEL_BASE}
                              highlightColor={SKEL_HI}
                              borderRadius={8}
                            />
                          </div>
                        ) : (
                          <div className="flex w-full flex-col gap-1.5">
                            <Skeleton
                              width={primaryWidth}
                              height={14}
                              baseColor={SKEL_BASE}
                              highlightColor={SKEL_HI}
                              borderRadius={6}
                              style={{ display: "inline-block" }}
                            />
                            {colCount > 2 &&
                            columnIndex > 0 &&
                            columnIndex < colCount - 2 ? (
                              <Skeleton
                                width={secondaryWidth}
                                height={10}
                                baseColor={SKEL_BASE}
                                highlightColor={SKEL_HI}
                                borderRadius={6}
                                style={{
                                  display: "inline-block",
                                  opacity: 0.9,
                                }}
                              />
                            ) : null}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showPaginationSkeleton && (
        <div className="mt-2 flex items-center justify-end">
          <div className="flex items-center gap-3">
            <Skeleton
              width={100}
              height={16}
              baseColor={SKEL_BASE}
              highlightColor={SKEL_HI}
              borderRadius={6}
            />
            <Skeleton
              width={70}
              height={28}
              baseColor={SKEL_BASE}
              highlightColor={SKEL_HI}
              borderRadius={8}
            />
            <Skeleton
              width={28}
              height={28}
              baseColor={SKEL_BASE}
              highlightColor={SKEL_HI}
              borderRadius={8}
            />
            <Skeleton
              width={28}
              height={28}
              baseColor={SKEL_BASE}
              highlightColor={SKEL_HI}
              borderRadius={8}
            />
          </div>
        </div>
      )}

      <div className="px-4 py-2 text-xs" style={{ color: TXT_MID }}>
        Loading data...
      </div>
    </section>
  );
};

export default DataTableSkeleton;
