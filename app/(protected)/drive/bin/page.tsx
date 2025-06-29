import Image from "next/image";

export default function BinPage() {
  return (
      <>
        <div className="text-2xl mb-4">Bin</div>
        <div className="w-full h-full flex flex-col justify-center items-center">
          <Image
            src="/assets/svg/empty_state_bin.svg"
            alt="empty bin page"
            width="240"
            height="240"
          />
          <div className="text-2xl mt-10">Bin is empty</div>
          <div className="text-md text-subtext0 mt-2">Items moved to the bin will be deleted forever after 30 days</div>
        </div>
      </>
    );
  }