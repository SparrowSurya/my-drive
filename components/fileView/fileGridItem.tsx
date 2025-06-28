import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import Icon from "../icon";
import FileIcon from "./fileIcon";
import { type FileData } from "./types";


export type FileGridItemProps = {
  file: FileData,
};


export default function FileGridItem({ file }: Readonly<FileGridItemProps>) {
  return (
    <div className="bg-surface2 hover:bg-surface1 px-2 py-3 rounded-2xl">
      <div className="flex flex-row items-center gap-3">
        <FileIcon type={file.type} />
        <span className="flex-1">{ file.name }</span>
        <Icon icon={faEllipsisVertical} hover />
      </div>
      <div className="p-3 bg-overlay0 h-42 my-3"></div>
    </div>
  );
}