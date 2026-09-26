import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getIdToken() {
  const session = await getSession();
  return session?.idToken;
}