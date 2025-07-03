import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";


export const metadata: Metadata = {
  title: "Drive: Store and share files online",
};

export default async function Home() {
  return (
    <div className="grid grid-cols-12 gap-0 px-8 py-16 w-full">
      <div></div>
      <section className="col-span-4 flex flex-col gap-5 justify-center">
        <div className="flex flex-row">
          <Image
            src="/assets/icons/logo.png"
            alt="Google drive logo"
            width="32"
            height="32"
          />
          <span className="text-lavender text-2xl ml-3">Google Drive</span>
        </div>
        <h1 className="text-5xl font-bold">Store and share files online</h1>
        <p className="text-lg text-subtext0">AI-powered cloud storage for seamless file sharing and enhanced collaboration.</p>
        <div className="flex flex-row items-center gap-3">
          <Link
            href="/auth/signin"
            className="px-3 py-2 bg-mauve text-base border rounded-lg cursor-pointer hover:bg-mauve/90"
          >SignIn</Link>
          <Link
            href="/auth/login"
            className="px-3 py-2 bg-base text-subtext0 border border-overlay0 rounded-lg cursor-pointer hover:border-mauve hover:text-mauve"
          >LogIn</Link>
        </div>
      </section>
      <div></div>
      <section className="col-span-5">
        <Image
          src="/assets/images/demo.png"
          alt="Google drive logo"
          width="360"
          height="360"
          style={{
            width: "100%",
          }}
        />
      </section>
      <div></div>
    </div>
  );
}
