import { Metadata } from "next";
import EmptyState from "@/components/emptyState";


export const metadata: Metadata = {
  title: "Recent - Drive",
};

export default function RecentPage() {
  return (
    <>
      <div className="drivePageHeading">Storage</div>
      <EmptyState
        image="/assets/svg/empty_state_recent.svg"
        title="No recent files"
        para="See all the files that you've recently edited or opened"
      />
    </>
  );
}