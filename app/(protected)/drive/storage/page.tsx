import Image from "next/image";

export default function StoragePage() {
  return (
      <>
        <div className="text-2xl mb-4 text-lavender">Storage</div>
        <div className="w-full h-full flex flex-col justify-center items-center">
          <Image
            src="/assets/svg/empty_state_storage.svg"
            alt="empty storage page"
            width="240"
            height="240"
          />
          <div className="text-2xl mt-10">No files are using storage</div>
          <div className="text-md text-subtext0 mt-2">Items you own will use Drive storage</div>
        </div>
      </>
    );
  }