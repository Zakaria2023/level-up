import { ReactNode } from "react";

interface DashboardCardProps {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
  contentClassName?: string;
  children: ReactNode;
}

export const DashboardCard = ({
  title,
  subtitle,
  action,
  className,
  contentClassName,
  children,
}: DashboardCardProps) => {
  const hasHeader = Boolean(title || subtitle || action);

  return (
    <section
      className={[
        "rounded-[28px] border border-white/70 bg-white/90 shadow-[0_20px_45px_rgba(15,23,42,0.06)] backdrop-blur-sm",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {hasHeader ? (
        <div className="flex items-start justify-between gap-4 px-5 pt-5">
          <div>
            {title ? (
              <h2 className="text-[15px] font-semibold text-[#0D3B52]">{title}</h2>
            ) : null}
            {subtitle ? (
              <p className="mt-1 text-[12px] text-[#97A6B6]">{subtitle}</p>
            ) : null}
          </div>

          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : null}

      <div
        className={[
          hasHeader ? "px-5 pb-5 pt-4" : "p-5",
          contentClassName,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </div>
    </section>
  );
};
