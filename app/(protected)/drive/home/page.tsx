import { Metadata } from "next";
import EmptyState from "@/components/emptyState";
import { getFileSuggestions, getFolderSuggestions } from "./query";
import FolderSuggestions from "./folderSuggestions";
import FileSuggestions from "./fileSuggestions";


export const metadata: Metadata = {
  title: "Home - Drive",
};

export default async function DriveHomePage() {
  const [files, folders] = await Promise.all([
    getFileSuggestions(24),
    getFolderSuggestions(8),
  ]);
  const isEmpty = files.length === 0 && folders.length === 0;

  return (
    <div className="flex flex-col gap-4 flex-1 overflow-y-auto min-h-0 outline-none">
      <div className="drivePageHeading shrink-0 ml-3">Welcome to Drive</div>
      {isEmpty ? (
        <div className="ml-3 min-h-0 h-full">
          <EmptyState />
        </div>
      ) : (
        <div className="flex flex-col ml-3">
          <FolderSuggestions folders={folders}  />
          <FileSuggestions files={files} />
        </div>
      )}
    </div>
  );
}
