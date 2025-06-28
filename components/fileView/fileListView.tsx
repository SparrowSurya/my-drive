import FileListRow from "./fileListRow";
import { FileInfo } from "./types";


export type FileListViewProps = {
  headings: string[],
  files: FileInfo[],
};


export default function FileListView({ headings, files }: Readonly<FileListViewProps>) {
  return (
    <table className="w-full text-left">
      <thead>
        <tr className="h-12 border-b-2 border-surface0 font-bold">
          {
            headings.map((title, index) => <td key={index}>{ title }</td>)
          }
        </tr>
      </thead>
      <tbody>
        {
          files.map((file, index) => <FileListRow key={index} file={file} />)
        }
      </tbody>
    </table>
  );
}