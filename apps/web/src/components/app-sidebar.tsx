import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
  Users,
  Building2,
  Package,
  GitBranch,
  GalleryVerticalEnd,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/useAuth"
import { createAbility } from "@/app/rbac/ability"
import { PERMISSIONS } from "@/app/rbac/permissions"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/app",
      icon: SquareTerminal,
      isActive: true,
      permission: PERMISSIONS.DASHBOARD.READ,
    },
    {
      title: "Inventory",
      url: "/app/inventory",
      icon: Package,
      permission: PERMISSIONS.INVENTORY.READ,
      items: [
        {
          title: "View Items",
          url: "/app/inventory",
          permission: PERMISSIONS.INVENTORY.READ,
        },
        {
          title: "Add Item",
          url: "/app/inventory/add",
          permission: PERMISSIONS.INVENTORY.WRITE,
        },
      ],
    },
    {
      title: "User Management",
      url: "/app/users",
      icon: Users,
      permission: PERMISSIONS.USERS.READ,
      items: [
        {
          title: "All Users",
          url: "/app/users",
          permission: PERMISSIONS.USERS.READ,
        },
        {
          title: "Add User",
          url: "/app/users/add",
          permission: PERMISSIONS.USERS.WRITE,
        },
      ],
    },
    {
      title: "Department Management",
      url: "/app/departments",
      icon: Building2,
      permission: PERMISSIONS.DEPARTMENTS.READ,
      items: [
        {
          title: "All Departments",
          url: "/app/departments",
          permission: PERMISSIONS.DEPARTMENTS.READ,
        },
        {
          title: "Add Department",
          url: "/app/departments/add",
          permission: PERMISSIONS.DEPARTMENTS.WRITE,
        },
      ],
    },
    {
      title: "Approval Sequence",
      url: "/app/approval-sequence",
      icon: GitBranch,
      permission: PERMISSIONS.APPROVAL_SEQUENCE.READ,
      items: [
        {
          title: "View Sequences",
          url: "/app/approval-sequence",
          permission: PERMISSIONS.APPROVAL_SEQUENCE.READ,
        },
        {
          title: "Create Sequence",
          url: "/app/approval-sequence/create",
          permission: PERMISSIONS.APPROVAL_SEQUENCE.WRITE,
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()
  const ability = createAbility(user)

  // Filter nav items based on permissions
  const filteredNavMain = data.navMain.filter(item => {
    if (item.permission) {
      return ability.can(item.permission)
    }
    return true
  }).map(item => ({
    ...item,
    items: item.items?.filter(subItem => {
      if (subItem.permission) {
        return ability.can(subItem.permission)
      }
      return true
    })
  }))

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">PCIC</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{
          name: user?.email || "User",
          email: user?.email || "",
          avatar: "/avatars/shadcn.jpg",
        }} />
      </SidebarFooter>
    </Sidebar>
  )
}
