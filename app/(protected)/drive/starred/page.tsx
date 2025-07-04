import { Metadata } from "next";
import EmptyState from "@/components/emptyState";


export const metadata: Metadata = {
  title: "Starred - Drive",
};

export default function StarredPage() {
  return (
    <>
      <div className="drivePageHeading">Storage</div>
      <EmptyState
        image="/assets/svg/empty_state_storage.svg"
        title="No starred files"
        para="Add stars to things that you want to easily find later"
      />
    </>
  );
}