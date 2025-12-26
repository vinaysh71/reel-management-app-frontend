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
} from "@/components/ui/sidebar"
import { FileStack, Layers, LayoutDashboard, Package, Settings } from "lucide-react"
import { AppSidebarLink } from "./ui/app-sidebar-link"

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
    title: "Usage",
    url: "#",
    icon: Package,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
] 

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
                key={item.url}
                href={item.url}
                label={item.title}
                icon={item.icon}
              />
                // <SidebarMenuItem key={item.title}>
                //   <SidebarMenuButton asChild>
                //     <a href={item.url}>
                //       <item.icon />
                //       <span>{item.title}</span>
                //     </a>
                //   </SidebarMenuButton>
                // </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
