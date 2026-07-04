import Sidebar from "../components/side-bar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Sidebar>{children}</Sidebar>;
}
