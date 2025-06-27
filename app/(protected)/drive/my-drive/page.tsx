"use client";

import useAuthRedirect from "@/hooks/authRedirect";

export default function MyDrivePage() {
  const { session, status } = useAuthRedirect();
  const expired = session?.expires ? (new Date(session.expires)).valueOf() <= Date.now() : true;

  return (
    <div>
      <div className="text-2xl cursor-pointer">My Drive</div>
      <p>Status: {status}</p>
      <p>Expired: {expired ? "true" : "false"}</p>
      {/* <p>Session: {session ? JSON.stringify(session) : "null"}</p> */}
    </div>
  );
}
