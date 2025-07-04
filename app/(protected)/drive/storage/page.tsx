import { Metadata } from "next";
import EmptyState from "@/components/emptyState";


export const metadata: Metadata = {
  title: "Storage - Drive",
};

export default function StoragePage() {
  return (
    <>
      <div className="drivePageHeading">Storage</div>
      <EmptyState
        image="/assets/svg/empty_state_storage.svg"
        title="No files are using storage"
        para="Items you own will use Drive storage"
      />
    </>
  );
}
