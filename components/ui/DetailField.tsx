export const DetailField = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className="rounded-[20px] border border-(--border-color) bg-[#F8FDFF] p-4">
    <p className="text-sm font-medium text-(--muted-text)">
      {label}
    </p>
    <p className="mt-2 text-sm font-semibold text-(--foreground)">{value}</p>
  </div>
);