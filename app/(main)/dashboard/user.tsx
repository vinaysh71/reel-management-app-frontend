"use client";

import { useSession } from "next-auth/react";

export default function User() {
  const { data: session, status } = useSession();

  return <pre>{JSON.stringify({ status, session }, null, 2)}</pre>;
}
