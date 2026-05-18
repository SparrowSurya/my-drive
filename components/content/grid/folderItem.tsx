import FileIcon from "../fileIcon";
import { type FolderData } from "../types";
import FileOption from "../components/fileOptions";


export type FolderGridItemProps = {
  folder: FolderData,
  showFolder: (id: number) => void,
};


export default function FileGridItem({ folder, showFolder }: Readonly<FolderGridItemProps>) {
  return (
    <div
      className="bg-surface2 hover:bg-surface1 px-2 py-3 rounded-2xl cursor-pointer"
      onDoubleClick={() => showFolder(folder.id)}
    >
      <div className="flex flex-row items-center gap-3">
        <FileIcon type={"folder"} />
        <span className="flex-1 truncate">{ folder.name }</span>
        <FileOption row={folder} />
      </div>
    </div>
  );
}
