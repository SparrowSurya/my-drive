import Image from "next/image";

export default function DriveHomePage() {
  return (
    <>
      <div className="text-2xl mb-4">Welcome to Drive</div>
      <div className="w-full h-full flex flex-col justify-center items-center">
        <Image
          src="/assets/svg/empty_state_home.svg"
          alt="cat with a file"
          width="160"
          height="160"
        />
        <div className="text-md text-subtext0 mt-2">Drag your files and folders here or use the &apos;New&apos; button to upload</div>
      </div>
    </>
  );
}