import FormError from "../feedback/FormError";

type FileFieldProps = {
  label: string;
  accept?: string;
  fileName?: string;
  error?: string;
  disabled?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const FileField = ({
  label,
  accept,
  fileName,
  error,
  disabled,
  ...props
}: FileFieldProps) => {
  return (
    <div className="w-full">
      <label className="mb-2 block text-[16px] font-medium text-[#0E6B7A]">
        {label}
        <span className="ml-2 text-[#EF4444]">*</span>
      </label>

      <label
        className={[
          "mt-1 flex min-h-30 cursor-pointer flex-col items-center justify-center rounded-[18px] border border-dashed bg-[#F8FDFF] px-4 py-5 text-center transition",
          error
            ? "border-[#EF4444] bg-[#FFF8F8]"
            : "border-[#B8C9D8] hover:border-[#29B5C5] hover:bg-[#F1FBFD]",
          disabled ? "cursor-not-allowed opacity-70" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <input
          type="file"
          accept={accept}
          disabled={disabled}
          className="hidden"
          {...props}
        />

        <span className="text-sm font-semibold text-[#0D3B52]">
          {fileName ? "Replace selected file" : "Choose a file"}
        </span>
        <span className="mt-1 text-xs text-[#6C8794]">
          {fileName || "No file selected yet"}
        </span>
      </label>

      <FormError>{error}</FormError>
    </div>
  );
};