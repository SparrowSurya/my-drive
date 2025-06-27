import Image from "next/image";
import { faMagnifyingGlass, faXmark, faSliders } from "@fortawesome/free-solid-svg-icons";
import { IconButton } from "@/components/icon";
import ProfileInfo from "./profile";

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
      <div className="col-span-5 flex flex-row items-center bg-surface0 gap-3 p-2 rounded-4xl">
          <IconButton icon={faMagnifyingGlass}  />
        <input
          type="text"
          placeholder="Search in Drive"
          className="flex-1 text-lg focus:outline-none caret-rosewater font-poppins"
        />
        <IconButton icon={faXmark}  />
        <IconButton icon={faSliders}  />
      </div>
      <div className="col-span-3 flex flex-row justify-end items-center gap-2">
        <ProfileInfo />
      </div>
    </nav>
  );
}