import FileIcon from "../fileIcon";
import { type FileData } from "../types";
import FileOption from "../components/fileOptions";


export type FileGridItemProps = {
  file: FileData,
};


export default function FileGridItem({ file }: Readonly<FileGridItemProps>) {
  return (
    <div className="bg-surface2 hover:bg-surface1 px-2 py-3 rounded-2xl">
      <div className="flex flex-row items-center gap-3">
        <FileIcon type={file.type} />
        <span className="flex-1">{ file.name }</span>
        <FileOption row={file} />
      </div>
      <div className="p-3 bg-overlay0 h-42 my-3"></div>
    </div>
  );
}
