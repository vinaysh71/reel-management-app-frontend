import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Building2,
  FileStack,
  Layers,
  LayoutDashboard,
  Package,
  Settings,
} from "lucide-react";
import { AppSidebarLink } from "./app-sidebar-link";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Reels",
    url: "/reels",
    icon: Layers,
  },
  {
    title: "Orders",
    url: "#",
    icon: FileStack,
  },
  {
    title: "Suppliers",
    url: "#",
    icon: Building2,
  },
  {
    title: "Usage",
    url: "#",
    icon: Package,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <AppSidebarLink
                  key={item.title}
                  href={item.url}
                  label={item.title}
                  icon={item.icon}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
