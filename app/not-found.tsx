import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Error 404 (not found)",
};

export default function NotFound() {
  return (
    <div className="flex justify-center items-center mt-20 gap-3">
      <div className="flex flex-col gap-3 w-[320px]">
        <div className="flex flex-row items-center gap-3">
          <Image
            src="/assets/icons/logo.png"
            alt="Google drive logo"
            width="32"
            height="32"
          />
          <div className="text-2xl">Drive</div>
        </div>
        <div className="">
          <span className="font-bold mr-2">404</span>
          Page not found
        </div>
        <div className="">The requested URL was not found on this server. That&apos;s all we know.</div>
      </div>
      <div>
        <Image
          src="/assets/images/robot.png"
          alt="Google drive logo"
          width="120"
          height="120"
          style={{ imageRendering: "pixelated" }}
        />
      </div>
    </div>
  );
}