import { isImagePreviewUrl } from "@/lib/utils/helpers";
import Image from "next/image";
import { FiFileText } from "react-icons/fi";

type PreviewableFileAsset = {
  name: string;
  previewUrl?: string;
};

type FilePreviewProps<TAsset extends PreviewableFileAsset> = {
  asset: TAsset;
};

export const FilePreview = <TAsset extends PreviewableFileAsset>({
  asset,
}: FilePreviewProps<TAsset>) => {
  if (asset.previewUrl && isImagePreviewUrl(asset.previewUrl)) {
    return (
      <div className="flex items-center justify-center">
        <Image
          src={asset.previewUrl}
          alt={asset.name}
          width={100}
          height={100}
          unoptimized
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-(--primary-soft) text-(--primary-strong)">
        <FiFileText className="text-lg" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-(--foreground)">
          {asset.name}
        </p>
        {asset.previewUrl ? (
          <a
            href={asset.previewUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold text-(--primary-strong) underline underline-offset-2"
          >
            Open preview
          </a>
        ) : (
          <p className="text-xs text-(--muted-text)">File uploaded</p>
        )}
      </div>
    </div>
  );
};
