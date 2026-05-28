import Image from "next/image";
import ProfileInfo from "./profile";
import ContentSearchInput from "./search";


export default async function Header() {
  return (
    <nav className="grid grid-cols-10 bg-crust py-3 px-5">
      <div className="col-span-2 flex flex-row items-center gap-3">
        <Image
          src="/assets/icons/logo.png"
          alt="Google drive logo"
          width="42"
          height="42"
        />
        <span className="text-2xl text-text">Drive</span>
      </div>
      <ContentSearchInput />
      <div className="col-span-3 flex flex-row justify-end items-center gap-2">
        <ProfileInfo />
      </div>
    </nav>
  );
}