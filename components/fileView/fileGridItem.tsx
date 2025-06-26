import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { IconButton } from "../icon";
import FileIcon from "./fileIcon";
import { type FileInfo } from "./types";

export type FileGridItemProps = FileInfo;

export default function FileGridItem({ type, name, avatar, reason }: Readonly<FileGridItemProps>) {
  return (
    <div className="bg-surface2 hover:bg-surface1 px-2 py-3 rounded-2xl">
      <div className="flex flex-row items-center gap-3">
        <FileIcon type={type} />
        <span className="flex-1">{ name }</span>
        <IconButton icon={faEllipsisVertical} />
      </div>
      <div className="p-3 bg-overlay0 h-42 my-3"></div>
      <div className="flex flex-row gap-3">
        <div className="flex flex-row gap-3 items-center mx-2">
          { avatar }
          <div className="text-sm">{ reason }</div>
        </div>
      </div>
    </div>
  );
}