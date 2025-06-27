"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import useAuthRedirect from "@/hooks/authRedirect";
import Modal from "@/components/modal";
import { Avatar } from "@/components/avatar";

export default function ProfileInfo() {
  const router = useRouter();
  const { session, status } = useAuthRedirect();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const user = session?.user;

  async function logout() {
    await signOut();
    router.push("/");
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
        char={ user!.email[0].toUpperCase() }
        size="medium"
        className="bg-lavender text-base"
        onClick={() => setIsModalOpen(true)}
      />
      {
        isModalOpen && (
          <Modal
            onClickOutside={() => setIsModalOpen(false)}
            className="absolute top-12 right-0 bg-surface1 w-72 border-1 border-overlay1 rounded-2xl p-3 z-50"
          >
            <div className="flex flex-col justify-center items-center">
              <div className="font-medium text-md">{ user!.email }</div>
              <div className="text-md">Managed by { user!.email?.split("@")[1] }</div>
              <Avatar
                char={ user!.email[0].toUpperCase() }
                size="large"
                className="bg-lavender text-base mt-8 mb-2"
                onClick={() => setIsModalOpen(true)}
              />
              <button
                className="bg-transparent text-lavender font-medium border-1 px-4 py-1 mt-3 rounded-3xl hover:bg-surface2"
                onClick={() => logout()}
              >Logout</button>
            </div>
          </Modal>
        )
      }
    </div>
  );
}
