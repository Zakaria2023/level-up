export const DetailField = ({
  label,
  value,
  valueDir,
}: {
  label: string;
  value: string;
  valueDir?: "auto" | "ltr" | "rtl";
}) => (
  <div className="rounded-[20px] border border-(--border-color) bg-[#F8FDFF] p-4">
    <p className="text-sm font-medium text-(--muted-text)">
      {label}
    </p>
    <p dir={valueDir} className="mt-2 text-sm font-semibold text-(--foreground)">
      {value}
    </p>
  </div>
);
