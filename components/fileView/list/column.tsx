import FileOption from "../components/options";
import FileIcon from "../fileIcon";
import { RowData, FileType } from "../types";
import { Column } from "./types";


const columns: Column<RowData>[] = [
  {
    key: "name",
    heading: "Name",
    render: (row: RowData, key: string) => (
      <td key={key}>
        <div className="flex flex-row items-center">
          <FileIcon type={row.type as FileType} />
          <span>{ row.name }</span>
        </div>
      </td>
    ),
  },
  {
    key: "lastModified",
    heading: "Last modified",
    render: (row: RowData, key: string) => (
      <td key={key}>{ row.lastModified }</td>
    ),
  },
  {
    key: "size",
    heading: "File size",
    render: (row: RowData, key: string) => (
      <td key={key} className={`${!row.size && "select-none"}`}>
        { row.size ?? "—" }
      </td>
    ),
  },
  {
    key: "moreOptions",
    heading: "",
    render: (row: RowData, key: string) => (
      <FileOption key={key} row={row} />
    ),
  },
];

export default columns;
