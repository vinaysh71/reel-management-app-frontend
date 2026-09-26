"use client";

import { useSession } from "next-auth/react";

export default function User() {
  const { data: session, status } = useSession();
  console.log("access token", session?.accessToken);
  console.log("id token", session?.idToken);

  return <pre>{JSON.stringify({ status, session }, null, 2)}</pre>;
}
