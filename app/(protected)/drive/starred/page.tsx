import Image from "next/image";

export default function StarredPage() {
  return (
      <>
        <div className="text-2xl mb-4">Welcome to Drive</div>
        <div className="w-full h-full flex flex-col justify-center items-center">
          <Image
            src="/assets/svg/empty_state_starred_files.svg"
            alt="empty starred files page"
            width="160"
            height="160"
          />
          <div className="text-2xl mt-10">No starred files</div>
          <div className="text-md text-subtext0 mt-2">Add stars to things that you want to easily find later</div>
        </div>
      </>
    );
  }