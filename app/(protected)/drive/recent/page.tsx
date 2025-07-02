import Image from "next/image";

export default function RecentPage() {
  return (
      <>
        <div className="text-2xl mb-4 text-lavender">Recent</div>
        <div className="w-full h-full flex flex-col justify-center items-center">
          <Image
            src="/assets/svg/empty_state_recent.svg"
            alt="empty recent page"
            width="240"
            height="240"
          />
          <div className="text-2xl mt-10">No recent files</div>
          <div className="text-md text-subtext0 mt-2">See all the files that you&apos;ve recently edited or opened</div>
        </div>
      </>
    );
  }