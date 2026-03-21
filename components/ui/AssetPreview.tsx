import { isImagePreviewUrl } from "@/lib/utils/helpers";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { FiFileText } from "react-icons/fi";

type PreviewableAsset = {
  name: string;
  previewUrl?: string;
};

type AssetPreviewProps<TAsset extends PreviewableAsset> = {
  title: string;
  asset: TAsset;
};

export const AssetPreview = <TAsset extends PreviewableAsset>({
  title,
  asset,
}: AssetPreviewProps<TAsset>) => {
  const { t } = useTranslation();

  return (
    <div className="rounded-[20px] border border-(--border-color) bg-[#F8FDFF] p-4">
      <p className="text-sm font-semibold text-[#0D3B52]">{title}</p>
      <div className="mt-4 flex min-h-32 items-center justify-center rounded-[18px] border border-dashed border-[#B8C9D8] bg-white px-4">
        {asset.previewUrl && isImagePreviewUrl(asset.previewUrl) ? (
          <div className="flex items-center gap-4">
            <Image
              src={asset.previewUrl}
              alt={asset.name}
              width={88}
              height={88}
              unoptimized
              className="object-cover"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-(--foreground)">
                {asset.name}
              </p>
              <p className="mt-1 text-xs text-(--muted-text)">
                {t("AssetPreview.imageFile")}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-(--primary-soft) text-(--primary-strong)">
              <FiFileText className="text-2xl" />
            </span>
            <p className="text-sm font-semibold text-(--foreground)">{asset.name}</p>
            {asset.previewUrl ? (
              <a
                href={asset.previewUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-(--primary-strong) underline underline-offset-2"
              >
                {t("AssetPreview.openPreview")}
              </a>
            ) : (
              <p className="text-xs text-(--muted-text)">
                {t("AssetPreview.fileUploaded")}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};