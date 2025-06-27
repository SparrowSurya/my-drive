import { faFile, faFileLines, faFileExcel, faFilePdf, faFileImage, faFileVideo, faFileAudio, faFilePowerpoint, faFileWord, faFileZipper, faFileCsv, faFileCode, faFolder } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "../icon";

export type FileType = "excel" | "pptx" | "docx" | "pdf" | "zip" | "txt" | "csv" | "file" | "audio" | "video" | "image" | "code" | "folder";

export const fileIcons = {
  excel: { icon: faFileExcel, color: "text-green" },
  pptx: { icon: faFilePowerpoint, color: "text-peach" },
  docx: { icon: faFileWord, color: "text-blue" },
  pdf: { icon: faFilePdf, color: "text-red" },
  zip: { icon: faFileZipper, color: "text-yellow" },
  txt: { icon: faFileLines, color: "text-blue" },
  csv: { icon: faFileCsv, color: "text-blue" },
  file: { icon: faFile, color: "text-text" },
  audio: { icon: faFileAudio, color: "text-red" },
  video: { icon: faFileVideo, color: "text-red" },
  image: { icon: faFileImage, color: "text-red" },
  code: { icon: faFileCode, color: "text-mauve" },
  folder: { icon: faFolder, color: "text-subtext1" },
} satisfies Record<FileType, Readonly<{ icon: IconDefinition, color: string }>>;

export type FileIconProps = {
  type: FileType,
};

export default function FileIcon({ type }: Readonly<FileIconProps>) {
  const { icon, color } = fileIcons[type];
  return <Icon icon={icon} className={`mx-4 ${color}`} />;
}
