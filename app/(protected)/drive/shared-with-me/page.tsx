import { Metadata } from "next";
import EmptyState from "@/components/emptyState";


export const metadata: Metadata = {
  title: "Shared with me - Drive",
};

export default function SharedWithMePage() {
  return (
    <>
      <div className="drivePageHeading">Storage</div>
      <EmptyState
        image="/assets/svg/empty_state_shared_with_me.svg"
        title="Files and folders others have shared with you"
        para={<div>Say &apos;goodbye&apos; to email attachments and &apos;hello&apos; to real-time collaboration. Drag anything shared with you to <b>My Drive</b> for easy access.</div>}
      />
    </>
  );
}