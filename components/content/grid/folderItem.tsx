import FileIcon from "../fileIcon";
import { type FolderData } from "../types";
import ContentOptionMenu from "../options";
import { ViewContext } from "../list/types";


export type FolderGridItemProps = {
  folder: FolderData,
  showFolder: (id?: number) => void,
  viewCtx?: ViewContext,
};


export default function FolderGridItem({ folder, showFolder, viewCtx }: Readonly<FolderGridItemProps>) {
  return (
    <div
      className="bg-surface2 hover:bg-surface1 px-2 py-3 rounded-2xl cursor-pointer"
      onDoubleClick={() => showFolder(folder.id)}
    >
      <div className="flex flex-row items-center gap-3">
        <FileIcon mimeType={undefined} />
        <div className="flex flex-col flex-1">
          <span className="truncate font-medium">{ folder.name }</span>
          {folder.reason && <span className="truncate text-xs">{ folder.reason }</span>}
        </div>
        <ContentOptionMenu data={folder} isTrash={viewCtx === "trash"} />
      </div>
    </div>
  );
}
