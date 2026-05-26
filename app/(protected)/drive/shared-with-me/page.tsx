import { Metadata } from "next";
import EmptyState from "@/components/emptyState";


export const metadata: Metadata = {
  title: "Shared with me - Drive",
};

export default function SharedWithMePage() {
  return (
    <div className="flex flex-col flex-1 overflow-hidden h-full ml-3">
      <div className="drivePageHeading mb-4">Shared with me</div>
      <div className="flex-1 flex flex-col min-h-0">
        <EmptyState
          image="/assets/svg/empty_state_shared_with_me.svg"
          title="Files and folders others have shared with you"
          para={<div>Say &apos;goodbye&apos; to email attachments and &apos;hello&apos; to real-time collaboration. Drag anything shared with you to <b>My Drive</b> for easy access.</div>}
        />
      </div>
    </div>
  );
  }