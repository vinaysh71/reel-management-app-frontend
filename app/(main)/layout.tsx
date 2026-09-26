import { authOptions } from "@/lib/auth";
import Sidebar from "../components/side-bar";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  console.log("SESSION:", session);

  if (!session) {
    console.log("NO SESSION -> REDIRECT");
    redirect("/login");
  }

  return <Sidebar>{children}</Sidebar>;
}
