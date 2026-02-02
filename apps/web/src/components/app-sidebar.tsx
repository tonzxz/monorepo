import type { ComponentProps } from "react"
import {
  BookOpen,
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
  type LucideIcon,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import pcic from "@/assets/pcic.png"
import type { Permission } from "@/app/rbac/permissions"
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

type NavSubItem = {
  title: string
  url: string
  permission?: Permission
}

type NavItem = {
  title: string
  url: string
  icon: LucideIcon
  isActive?: boolean
  permission?: Permission
  items?: NavSubItem[]
}

type SecondaryNavItem = {
  title: string
  url: string
  icon: LucideIcon
}

type ProjectItem = {
  name: string
  url: string
  icon: LucideIcon
}

const navMain: NavItem[] = [
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
  ]

const navSecondary: SecondaryNavItem[] = [
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
  ]

const projects: ProjectItem[] = [
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
  ]

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain,
  navSecondary,
  projects,
}

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()
  const ability = createAbility(user)
  const fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()
  const displayName = fullName || user?.email || "User"

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
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg overflow-hidden">
                  <img src={pcic} alt="PCIC" className="size-6 object-contain" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
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
          name: displayName,
          email: user?.email || "",
          avatar: "/avatars/shadcn.jpg",
        }} />
      </SidebarFooter>
    </Sidebar>
  )
}
