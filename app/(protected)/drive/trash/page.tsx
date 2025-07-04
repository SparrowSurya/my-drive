import { Metadata } from "next";
import EmptyState from "@/components/emptyState";


export const metadata: Metadata = {
  title: "Trash - Drive",
};

export default function TrashPage() {
  return (
    <>
      <div className="drivePageHeading">Storage</div>
      <EmptyState
        image="/assets/svg/empty_state_trash.svg"
        title="Trash is empty"
        para="Items moved to the trash will be deleted forever after 30 days"
      />
    </>
  );
}