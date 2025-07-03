import React from "react";
import Oauth from "./oauth";
import Loading from "@/components/loader";


export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode,
}>) {
  return (
    <div className="min-h-svh min-w-svw flex justify-center items-center">
      <div className="max-w-md w-full m-8 p-12 bg-mantle outline-1 border border-base outline-none shadow-lg shadow-base rounded-lg">
        <React.Suspense fallback={<Loading />}>
          { children }
        </React.Suspense>
        <Oauth />
      </div>
    </div>
  );
}
