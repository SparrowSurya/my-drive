
export const slugify = (s: string): string => {
  return s.toLowerCase().replaceAll(" ", "-");
};

export const fileExt = (filename: string): string => {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase();
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);

  const formatted = value % 1 === 0 ? value.toString() : value.toFixed(1);

  return `${formatted} ${sizes[i]}`;
}
