import FileGridItem from "./fileItem";
import FolderGridItem from "./folderItem";
import { type ContentData } from "../types";

export type GridViewProps = {
  data: ContentData[],
};

export default function FileGridView({ data }: Readonly<GridViewProps>) {
  const files = data.filter((item) => item.type != "folder");
  const folders = data.filter((item) => item.type == "folder");

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-4 gap-3 p-3">
        {
          folders.map((folder, index) => <FolderGridItem key={index} folder={folder} />)
        }
      </div>
      <div className="grid grid-cols-4 gap-3 p-3">
        {
          files.map((file, index) => <FileGridItem key={index} file={file} />)
        }
      </div>
    </div>
  );
}