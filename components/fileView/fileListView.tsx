import FileListRow from "./fileListRow";
import { FileData } from "./types";


export type FileListViewProps = {
  headings: string[],
  files: FileData[],
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