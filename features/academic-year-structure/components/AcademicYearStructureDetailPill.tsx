type AcademicYearStructureDetailPillProps = {
  label: string;
  value: string;
};

const AcademicYearStructureDetailPill = ({
  label,
  value,
}: AcademicYearStructureDetailPillProps) => (
  <div className="rounded-2xl border border-(--border-color) bg-white px-4 py-3">
    <p className="text-xs font-semibold uppercase text-(--muted-text)">
      {label}
    </p>
    <p className="mt-2 text-sm font-semibold text-(--foreground)">{value}</p>
  </div>
);

export default AcademicYearStructureDetailPill;
