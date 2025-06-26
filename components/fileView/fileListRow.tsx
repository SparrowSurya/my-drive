import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { IconButton } from "@/components/icon";
import FileIcon from "./fileIcon";
import { type FileInfo } from "./types";

export type FileListRowProp = FileInfo;

export default function FileListRow({
  type,
  owner,
  name,
  avatar,
  reason,
}: Readonly<FileListRowProp>) {
  return (
    <tr className="h-12 hover:bg-surface1 border-b-2 border-surface0">
      <td>
        <div className="flex flex-row items-center h-12 pl-2">
          <FileIcon type={type} />
          <div className="">{ name }</div>
        </div>
      </td>
      <td>{ reason }</td>
      <td>
        <div className="h-12 flex flex-row gap-3 items-center">
          { avatar }
          <div className="">{ owner }</div>
        </div>
      </td>
      <td>
        <IconButton icon={faEllipsisVertical} />
      </td>
    </tr>
  );
}
