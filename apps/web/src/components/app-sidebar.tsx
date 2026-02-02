import type { ComponentProps } from "react"
import {
  LifeBuoy,
  Send,
  ShieldCheck,
  SquareTerminal,
  Users,
  Building2,
  Package,
  GitBranch,
  type LucideIcon,
} from "lucide-react"

import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { SidebarItems } from "@/components/common/sidebar-items"
import pcic from "@/assets/pcic.png"
import type { Permission } from "@/app/rbac/permissions"
import type { Role } from "@/app/rbac/roles"
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
import { PERMISSIONS } from "@/app/rbac/permissions"

type NavSubItem = {
  title: string
  url: string
  permission?: Permission
  roles?: Role[]
}

type NavItem = {
  title: string
  url: string
  icon: LucideIcon
  isActive?: boolean
  permission?: Permission
  roles?: Role[]
  items?: NavSubItem[]
}

type SecondaryNavItem = {
  title: string
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
      title: "PPMP",
      url: "/app/ppmp",
      icon: Package,
      permission: PERMISSIONS.PPMP.READ,
      items: [
        {
          title: "View Items",
          url: "/app/ppmp",
          permission: PERMISSIONS.PPMP.READ,
        },
        {
          title: "Add Item",
          url: "/app/ppmp/add",
          permission: PERMISSIONS.PPMP.WRITE,
        },
      ],
    },
    {
      title: "User Management",
      url: "/app/users",
      icon: Users,
      permission: PERMISSIONS.USERS.READ,
      roles: ["SuperAdmin"],
      items: [
        {
          title: "All Users",
          url: "/app/users",
          permission: PERMISSIONS.USERS.READ,
          roles: ["SuperAdmin"],
        },
        {
          title: "Add User",
          url: "/app/users/add",
          permission: PERMISSIONS.USERS.WRITE,
          roles: ["SuperAdmin"],
        },
      ],
    },
    {
      title: "Permissions",
      url: "/app/permissions",
      icon: ShieldCheck,
      permission: PERMISSIONS.USERS.READ,
      roles: ["SuperAdmin"],
    },
    {
      title: "Department Management",
      url: "/app/departments",
      icon: Building2,
      permission: PERMISSIONS.DEPARTMENTS.READ,
      roles: ["SuperAdmin"],
      items: [
        {
          title: "All Departments",
          url: "/app/departments",
          permission: PERMISSIONS.DEPARTMENTS.READ,
          roles: ["SuperAdmin"],
        },
        {
          title: "Add Department",
          url: "/app/departments/add",
          permission: PERMISSIONS.DEPARTMENTS.WRITE,
          roles: ["SuperAdmin"],
        },
      ],
    },
    {
      title: "Approval Sequence",
      url: "/app/approval-sequence",
      icon: GitBranch,
      permission: PERMISSIONS.APPROVAL_SEQUENCE.READ,
      roles: ["SuperAdmin"],
      items: [
        {
          title: "View Sequences",
          url: "/app/approval-sequence",
          permission: PERMISSIONS.APPROVAL_SEQUENCE.READ,
          roles: ["SuperAdmin"],
        },
        {
          title: "Create Sequence",
          url: "/app/approval-sequence/create",
          permission: PERMISSIONS.APPROVAL_SEQUENCE.WRITE,
          roles: ["SuperAdmin"],
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

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain,
  navSecondary,
}

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()
  const fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()
  const displayName = fullName || user?.email || "User"

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
        <SidebarItems items={data.navMain} />
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
