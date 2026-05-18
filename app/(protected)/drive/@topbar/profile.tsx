"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import useAuthRedirect from "@/hooks/authRedirect";
import Modal from "@/components/modal";
import { Avatar } from "@/components/avatar";

export default function ProfileInfo() {
  const { session, status } = useAuthRedirect();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const user = session?.user;
  const username = user?.name ?? "";

  async function logout() {
    await signOut({ callbackUrl: '/' });
  }

  if (status === "loading") {
    return (
      <div className="animate-spin rounded-full size-[24] border-t-2 border-b-2 border-primary"></div>
    );
  }

  if (status === "unauthenticated" || user === null) {
    return (
      <Link
        href="/auth/login"
        className="bg-lavender text-base cursor-pointer hover:bg-text rounded-lg p-2"
      >Login</Link>
    );
  }

  return (
    <div className="relative">
      <Avatar
        text={username}
        size="medium"
        className="bg-lavender text-base"
        onClick={() => setIsModalOpen(true)}
      />
      {
        isModalOpen && (
          <Modal
            onClickOutside={() => setIsModalOpen(false)}
            className="absolute top-12 right-0 bg-surface1 w-72 border border-overlay1 rounded-2xl p-3 z-50"
          >
            <div className="flex flex-col justify-center items-center min-w-60">
              <div className="font-medium text-md">{ user!.email }</div>
              <div className="text-sm">Managed by { user!.email?.split("@")[1] }</div>
              <div className="text-lg mt-8">Hi { username.split(' ')[0] }!</div>
              <Avatar
                text={username}
                size="large"
                className="bg-lavender text-base my-2"
                onClick={() => setIsModalOpen(true)}
              />
              <button
                className="bg-transparent text-lavender font-medium border px-4 py-1 mt-3 rounded-3xl hover:bg-surface2"
                onClick={() => logout()}
              >Logout</button>
            </div>
          </Modal>
        )
      }
    </div>
  );
}
