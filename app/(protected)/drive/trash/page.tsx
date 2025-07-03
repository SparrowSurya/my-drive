import Image from "next/image";

export default function TrashPage() {
  return (
      <>
        <div className="text-2xl mb-4">Trash</div>
        <div className="w-full h-full flex flex-col justify-center items-center">
          <Image
            src="/assets/svg/empty_state_trash.svg"
            alt="empty trash page"
            width="240"
            height="240"
          />
          <div className="text-2xl mt-10">Trash is empty</div>
          <div className="text-md text-subtext0 mt-2">Items moved to the trash will be deleted forever after 30 days</div>
        </div>
      </>
    );
  }