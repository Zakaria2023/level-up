export const isImagePreviewUrl = (previewUrl?: string) =>
  Boolean(
    previewUrl &&
    (previewUrl.startsWith("data:image/") ||
      /\.(png|jpe?g|webp|gif|svg)$/i.test(previewUrl)),
  );

export const renderBooleanValue = (value: boolean) =>
  value ? "Enabled" : "Disabled";
