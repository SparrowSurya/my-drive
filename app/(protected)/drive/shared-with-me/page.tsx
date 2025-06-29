import Image from "next/image";

export default function SharedWithMePage() {
  return (
      <>
        <div className="text-2xl mb-4">Welcome to Drive</div>
        <div className="w-full h-full flex flex-col justify-center items-center">
          <Image
            src="/assets/svg/empty_state_shared_with_me.svg"
            alt="empty shared with me page"
            width="240"
            height="240"
          />
          <div className="text-2xl mt-10">Files and folders others have shared with you</div>
          <div className="text-md text-subtext0 mt-2">Say &apos;goodbye&apos; to email attachments and &apos;hello&apos; to real-time collaboration. Drag anything shared with you to <b>My Drive</b> for easy access.</div>
        </div>
      </>
    );
  }