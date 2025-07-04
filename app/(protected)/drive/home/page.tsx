import { Metadata } from "next";
import EmptyState from "@/components/emptyState";


export const metadata: Metadata = {
  title: "Home - Drive"
};

export default function DriveHomePage() {
  return (
    <>
      <div className="drivePageHeading">Storage</div>
      <EmptyState
        image="/assets/svg/empty_state_home.svg"
        title="Drag your files and folders here or use the 'New' button to upload"
      />
    </>
  );
}