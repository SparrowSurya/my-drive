import FileGridItem from "./fileItem";
import FolderGridItem from "./folderItem";
import { type ContentData } from "../types";

export type GridViewProps = {
  data: ContentData[],
  showFolder: (id: number) => void,
  className?: string,
};

export default function ContentGridView({ data, showFolder, className }: Readonly<GridViewProps>) {
  const files = data.filter((item) => item.type != "folder");
  const folders = data.filter((item) => item.type == "folder");

  return (
    <div className={className ?? "flex-1 flex flex-col gap-5 overflow-y-auto min-h-0"}>
      <div className="grid grid-cols-4 gap-3 p-3 shrink-0">
        {
          folders.map((folder, index) => <FolderGridItem key={index} folder={folder} showFolder={showFolder} />)
        }
      </div>
      <div className="grid grid-cols-4 gap-3 p-3 shrink-0">
        {
          files.map((file, index) => <FileGridItem key={index} file={file} />)
        }
      </div>
    </div>
  );
}
