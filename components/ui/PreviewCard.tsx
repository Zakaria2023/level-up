import { isImagePreviewUrl } from "@/lib/utils/helpers";
import Image from "next/image";
import { FiFileText } from "react-icons/fi";

type PreviewCardProps = {
  title: string;
  previewUrl?: string;
  fileName?: string;
  emptyText: string;
};

export const PreviewCard = ({
  title,
  previewUrl,
  fileName,
  emptyText,
}: PreviewCardProps) => (
  <div className="rounded-[20px] border border-(--border-color) bg-[#F8FDFF] p-4">
    <p className="text-sm font-semibold text-[#0D3B52]">{title}</p>
    <div className="mt-3 flex min-h-28 items-center justify-center rounded-[18px] border border-dashed border-[#B8C9D8] bg-white px-4">
      {previewUrl ? (
        isImagePreviewUrl(previewUrl) ? (
          <Image
            src={previewUrl}
            alt={title}
            width={96}
            height={96}
            unoptimized
            className="h-20 w-20 rounded-2xl object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-center">
            <FiFileText className="text-3xl text-(--primary-strong)" />
            <p className="text-sm font-semibold text-[#0D3B52]">
              {fileName || "Document selected"}
            </p>
            <a
              href={previewUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-(--primary-strong) underline underline-offset-2"
            >
              Open preview
            </a>
          </div>
        )
      ) : fileName ? (
        <div className="flex flex-col items-center gap-2 text-center">
          <FiFileText className="text-3xl text-(--primary-strong)" />
          <p className="text-sm font-semibold text-[#0D3B52]">{fileName}</p>
          <p className="text-xs text-[#6C8794]">Current uploaded file</p>
        </div>
      ) : (
        <p className="text-center text-xs text-[#6C8794]">{emptyText}</p>
      )}
    </div>
  </div>
);