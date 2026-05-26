import { Metadata } from "next";
import EmptyState from "@/components/emptyState";


export const metadata: Metadata = {
  title: "Storage - Drive",
};

export default function StoragePage() {
  return (
    <div className="flex flex-col flex-1 overflow-hidden h-full ml-3">
      <div className="drivePageHeading mb-4">Storage</div>
      <div className="flex-1 flex flex-col min-h-0">
        <EmptyState
          image="/assets/svg/empty_state_storage.svg"
          title="No files are using storage"
          para="Items you own will use Drive storage"
        />
      </div>
    </div>
  );
}
