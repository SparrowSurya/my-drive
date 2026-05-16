import FileGridItem from "./fileItem";
import FolderGridItem from "./folderItem";
import { type ContentData } from "../types";
import useFileUpload from "@/hooks/useFileUpload";
import useDropzone from "@/hooks/useDropzone";

export type GridViewProps = {
  data: ContentData[],
  openFolder: (id: number) => void,
};

export default function FileGridView({ data, openFolder }: Readonly<GridViewProps>) {
  const { uploadFile } = useFileUpload();
  const [dropRef, isDragging] = useDropzone(uploadFile);

  const files = data.filter((item) => item.type != "folder");
  const folders = data.filter((item) => item.type == "folder");

  return (
    <div
      ref={dropRef}
      className={`flex-1 flex flex-col gap-5 overflow-y-auto min-h-0 ${isDragging ? "border-sapphire" : "border-transparent"}`}
    >
      <div className="grid grid-cols-4 gap-3 p-3">
        {
          folders.map((folder, index) => <FolderGridItem key={index} folder={folder} openFolder={openFolder} />)
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