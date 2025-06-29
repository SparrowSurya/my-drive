import { faFile, faFileLines, faFileExcel, faFilePdf, faFileImage, faFileVideo, faFileAudio, faFilePowerpoint, faFileWord, faFileZipper, faFileCsv, faFileCode, faFolder } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import Icon, { type IconProp } from "@/components/icon";
import { fileExt } from "@/lib/utils/string";

export type FileType = "excel" | "pptx" | "docx" | "pdf" | "zip" | "txt" | "csv" | "file" | "audio" | "video" | "image" | "code" | "folder";

export const fileExtGroup: Record<"image" | "audio" | "video" | "code", string[]> = {
  image: [ "jpg", "jpeg", "png", "gif", "bmp", "svg", "webp", "heic", "tiff", "ico", "avif" ],
  audio: [ "mp3", "wav", "ogg", "flac", "aac", "m4a", "wma", "aiff", "alac", "opus" ],
  video: [ "mp4", "mkv", "avi", "mov", "wmv", "webm", "mpeg", "m4v" ],
  code: [ "js", "ts", "tsx", "jsx", "py", "java", "c", "cpp", "cs", "go", "php", "html", "css", "json", "xml", "yml", "yaml", "sh", "rs", "swift", "kt", "dart", "sql" ],
};

export const fileIcons = {
  excel: { icon: faFileExcel, color: "#A6E3A1" },
  pptx: { icon: faFilePowerpoint, color: "#FAB387" },
  docx: { icon: faFileWord, color: "#89B4FA" },
  pdf: { icon: faFilePdf, color: "#F38BA8" },
  zip: { icon: faFileZipper, color: "#F9E2AF" },
  txt: { icon: faFileLines, color: "#89B4FA" },
  csv: { icon: faFileCsv, color: "#89B4FA" },
  file: { icon: faFile, color: "#cdd6f4" },
  audio: { icon: faFileAudio, color: "#F38BA8" },
  video: { icon: faFileVideo, color: "#F38BA8" },
  image: { icon: faFileImage, color: "#F38BA8" },
  code: { icon: faFileCode, color: "#CBA6F7" },
  folder: { icon: faFolder, color: "#BAC2DE" },
} satisfies Record<FileType, Readonly<{ icon: IconDefinition, color: string }>>;

export type FileIconProps = {
  type: FileType,
} & Omit<IconProp, "icon">;

export function getFileType(name: string): FileType {
  const ext = fileExt(name);
  console.log(name, "->", ext);
  for (const [key, values] of Object.entries(fileExtGroup)) {
    if (values.includes(ext)) return key as FileType;
  }
  return (ext in fileIcons) ? ext as FileType : "file";
}

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
