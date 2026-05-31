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
        <EmptyState />
      </div>
    </div>
  );
  }