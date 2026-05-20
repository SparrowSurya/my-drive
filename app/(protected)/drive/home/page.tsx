import { Metadata } from "next";
import EmptyState from "@/components/emptyState";
import { getFileSuggestions, getFolderSuggestions } from "./query";
import FolderSuggestions from "./folderSuggestions";
import FileSuggestions from "./fileSuggestions";


export const metadata: Metadata = {
  title: "Home - Drive"
};

export default async function DriveHomePage() {
  const [files, folders] = await Promise.all([
    getFileSuggestions(24),
    getFolderSuggestions(8),
  ]);
  const isEmpty = files.length == 0 && folders.length == 0;

  return (
    <div className="flex flex-col gap-6 flex-1 overflow-y-auto min-h-0 pr-4 outline-none">
      <div className="drivePageHeading shrink-0">Welcome to Drive</div>
      {isEmpty ? (
        <EmptyState
          image="/assets/svg/empty_state_home.svg"
          title="Drag your files and folders here or use the 'New' button to upload"
        />
      ) : (
        <div className="flex flex-col gap-3">
          <FolderSuggestions folders={folders}  />
          <FileSuggestions files={files} />
        </div>
      )}
    </div>
  );
}
