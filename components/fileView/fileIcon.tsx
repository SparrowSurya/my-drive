import Icon, { type IconProp } from "@/components/icon";
import { fileIcons } from "./data";
import type { FileType } from "./types";


export type FileIconProps = {
  type: FileType,
} & Omit<IconProp, "icon">;


export default function FileIcon({ type, style, className }: Readonly<FileIconProps>) {
  const { icon, color } = fileIcons[type];
  return (
    <Icon
      icon={icon}
      className={`mx-4 ${className}`}
      style={{ color, ...style }}
    />
  );
}
