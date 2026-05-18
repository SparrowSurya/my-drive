import { Metadata } from "next";
import ContentSuggestions from "./suggestions";
import EmptyState from "@/components/emptyState";
import { getFileSuggestions, getFolderSuggestions } from "./query";


export const metadata: Metadata = {
  title: "Home - Drive"
};

export default async function DriveHomePage() {
  const [files, folders] = await Promise.all([
    getFileSuggestions(),
    getFolderSuggestions(),
  ]);

  return (
    <div className="flex flex-col gap-6 h-screen">
      <div className="drivePageHeading">Welcome to Drive</div>
      {true ? (
        <EmptyState
          image="/assets/svg/empty_state_home.svg"
          title="Drag your files and folders here or use the 'New' button to upload"
        />
      ) : (
        <ContentSuggestions files={files} folders={folders} />
      )}
    </div>
  );
}
