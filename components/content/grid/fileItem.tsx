import FileIcon from "../fileIcon";
import { type ContentData } from "../types";
import ContentOptionMenu from "../option";
import { Avatar } from "@/components/avatar";
import utils from "@/lib/utils";


export type FileGridItemProps = {
  file: ContentData,
  showFile: (id?: number) => void,
};

export default function FileGridItem({ file, showFile }: Readonly<FileGridItemProps>) {
  const mimeType = file.type === "file" ? file.mimeType : undefined;
  const lastModified = file.updatedAt instanceof Date
    ? utils.formatDate(file.updatedAt)
    : null;

  return (
    <div
      className="bg-surface2 hover:bg-surface1 px-2 py-3 rounded-2xl cursor-pointer"
      onDoubleClick={() => showFile(file.id)}
    >
      <div className="flex flex-row items-center gap-1">
        <FileIcon mimeType={mimeType} />
        <span className="flex-1 truncate font-medium">{ file.name }</span>
        <ContentOptionMenu data={ file } />
      </div>
      <div
        className="p-3 bg-mantle rounded-md h-42 my-3 overflow-clip flex justify-center items-center"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              -45deg,
              rgba(255,255,255,0.1),
              rgba(255,255,255,0.1) 3px,
              transparent 1px,
              transparent 8px
            )
          `,
        }}>
          <FileIcon
            mimeType={mimeType}
            style={{
              transform: "scale(8)",
              opacity: 0.75,
            }}
          />
        </div>
      {file.reason && (
        <div className="flex flex-row gap-3 items-center mx-2">
          <Avatar text={ file.owner } size="small" className="bg-lavender text-base my-2" />
          <span className="text-sm truncate">{ file.reason }</span>
          <span className="flex items-center gap-1 text-sm shrink-0">
            <strong className="text-text leading-none mr-1">·</strong>
            { lastModified?.split(",")[0] }
          </span>
        </div>
      )}
    </div>
  );
}
