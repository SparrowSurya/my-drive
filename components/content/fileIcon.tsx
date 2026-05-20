import { faCogs, faFile, faFileAudio, faFileCode, faFileExcel, faFileImage, faFilePdf, faFilePowerpoint, faFileText, faFileVideo, faFileWord, faFileZipper, faFolder, faFont, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import Icon, { type IconProp } from "@/components/icon";
import * as mimeUtils from "@/lib/mime/utils";


export type FileIconProps = {
  mimeType?: string,
} & Omit<IconProp, "icon">;


export default function FileIcon({ mimeType, style, className }: Readonly<FileIconProps>) {
  const [icon, type] = fileIconFromMime(mimeType);
  console.log(`MIME: ${mimeType} -> ${type}`);

  return (
    <Icon
      icon={icon}
      className={`fileIcon fileIcon-${type} ${className ?? ""}`}
      style={style}
    />
  );
}


export function fileIconFromMime(mimeType?: string): [IconDefinition, string] {
  if (mimeType === null || mimeType === undefined) return [faFolder, "folder"];
  if (mimeUtils.isImage(mimeType)) return [faFileImage, "image"];
  if (mimeUtils.isAudio(mimeType)) return [faFileAudio, "audio"];
  if (mimeUtils.isVideo(mimeType)) return [faFileVideo, "video"];
  if (mimeUtils.isPdf(mimeType)) return [faFilePdf, "pdf"];
  if (mimeUtils.isCode(mimeType)) return [faFileCode, "code"];
  if (mimeUtils.isConfig(mimeType)) return [faCogs, "config"];
  if (mimeUtils.isText(mimeType)) return [faFileText, "text"];
  if (mimeUtils.isSpreadsheet(mimeType)) return [faFileExcel, "spreadsheet"];
  if (mimeUtils.isDocument(mimeType)) return [faFileWord, "document"];
  if (mimeUtils.isPresentation(mimeType)) return [faFilePowerpoint, "presentation"];
  if (mimeUtils.isArchive(mimeType)) return [faFileZipper, "archive"];
  if (mimeUtils.isFont(mimeType)) return [faFont, "font"];
  return [faFile, "file"];
}
