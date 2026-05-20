"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import useAuthRedirect from "@/hooks/authRedirect";
import Modal from "@/components/modal";
import { Avatar } from "@/components/avatar";
import Icon from "@/components/icon";
import { faSignOutAlt, faGear } from "@fortawesome/free-solid-svg-icons";

export default function ProfileInfo() {
  const { session, status } = useAuthRedirect();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const user = session?.user;
  const username = user?.name ?? "";
  const email = user?.email ?? "";
  
  const triggerRef = useRef<HTMLDivElement>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isModalOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 8,
        left: rect.right - 320 // w-80 is 320px
      });
    }
  }, [isModalOpen]);

  async function logout() {
    await signOut({ callbackUrl: '/' });
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center size-9">
        <div className="animate-spin rounded-full size-5 border-t-2 border-b-2 border-lavender"></div>
      </div>
    );
  }

  if (status === "unauthenticated" || !user) {
    return (
      <Link
        href="/auth/login"
        className="bg-lavender text-crust font-semibold px-4 py-2 hover:bg-lavender/90 transition-colors rounded-lg shadow-sm"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="relative flex items-center" ref={triggerRef}>
      <div className="p-1 hover:bg-surface0 rounded-full transition-colors cursor-pointer">
        <Avatar
          text={username}
          size="medium"
          className="bg-lavender text-crust"
          onClick={() => setIsModalOpen(true)}
        />
      </div>
      
      {isModalOpen && (
        <Modal
          portal="id_dialog"
          onClickOutside={() => setIsModalOpen(false)}
          className="fixed bg-base w-80 border border-surface1 rounded-3xl p-4 shadow-2xl z-[1000001] flex flex-col items-center"
          style={{ 
            top: dropdownPos.top,
            left: dropdownPos.left
          }}
        >
          <div className="w-full text-center mb-6 px-2">
            <div className="text-subtext1 text-sm font-medium mb-4">{ email }</div>
            
            <div className="flex flex-col items-center gap-2 mb-4">
              <Avatar
                text={username}
                size="large"
                className="bg-lavender text-crust shadow-lg"
              />
              <div className="text-xl text-text font-medium mt-2">Hi, { username.split(' ')[0] }!</div>
            </div>

            <Link 
              href="#" 
              className="inline-block px-4 py-2 border border-surface1 rounded-full text-sm text-lavender hover:bg-surface0 transition-colors mb-2"
            >
              Manage your Account
            </Link>
          </div>

          <div className="w-full flex flex-col gap-1 border-t border-surface1 pt-4">
            <button
              className="flex items-center gap-3 w-full px-4 py-3 text-text hover:bg-surface0 transition-colors rounded-xl text-sm font-medium"
              onClick={() => {}}
            >
              <Icon icon={faGear} className="text-subtext0" />
              Settings
            </button>
            
            <button
              className="flex items-center gap-3 w-full px-4 py-3 text-red hover:bg-red/10 transition-colors rounded-xl text-sm font-medium"
              onClick={() => logout()}
            >
              <Icon icon={faSignOutAlt} />
              Sign out
            </button>
          </div>
          
          <div className="mt-4 flex flex-row gap-4 text-[11px] text-subtext0">
            <Link href="#" className="hover:underline">Privacy Policy</Link>
            <span>•</span>
            <Link href="#" className="hover:underline">Terms of Service</Link>
          </div>
        </Modal>
      )}
    </div>
  );
}
