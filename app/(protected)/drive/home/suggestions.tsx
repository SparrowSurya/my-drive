import { FileData, FolderData } from "@/components/content/types";
import FileSuggestions from "./@fileSuggestions/page";
import FolderSuggestions from "./@folderSuggestions/page";

export type ContentSuggestionsProps = {
  files: FileData[],
  folders: FolderData[],
};

export default function ContentSuggestions({ files, folders }: Readonly<ContentSuggestionsProps>) {
  return (
    <div className="flex flex-col gap-3 overflow-y-auto min-h-0">
      <FolderSuggestions folders={folders}  />
      <FileSuggestions files={files} />
    </div>
  );
}
