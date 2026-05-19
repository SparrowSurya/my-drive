import FileIcon from "../fileIcon";
import { type FileData } from "../types";
import FileOption from "../components/fileOptions";
import { Avatar } from "@/components/avatar";


export type FileGridItemProps = {
  file: FileData,
  showFile: (ind: number) => void,
};


export default function FileGridItem({ file, showFile }: Readonly<FileGridItemProps>) {
  return (
    <div
      className="bg-surface2 hover:bg-surface1 px-2 py-3 rounded-2xl cursor-pointer"
      onDoubleClick={() => showFile(file.id)}
    >
      <div className="flex flex-row items-center gap-3">
        <FileIcon type={file.type} />
        <span className="flex-1 truncate font-medium">{ file.name }</span>
        <FileOption row={file} />
      </div>
      <div className="p-3 bg-overlay0 h-42 my-3"></div>
      {file.reason && (
        <div className="flex flex-row gap-3 items-center mx-2">
          <Avatar text={file.owner} size="small" className="bg-lavender text-base my-2" />
          <span className="text-sm truncate flex-1">{file.reason}</span>
          <span className="flex items-center gap-1 text-sm shrink-0">
            <strong className="text-text leading-none mr-1">·</strong>
            {file.lastModified.split(",")[0]}
          </span>
        </div>
      )}
    </div>
  );
}
