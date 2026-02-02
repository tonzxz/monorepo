import type { LucideIcon } from "lucide-react"
import { useMemo } from "react"
import { NavMain } from "@/components/nav-main"
import { useAuth } from "@/hooks/useAuth"
import { createAbility } from "@/app/rbac/ability"
import type { Permission } from "@/app/rbac/permissions"
import type { Role } from "@/app/rbac/roles"

export type SidebarSubItem = {
  title: string
  url: string
  permission?: Permission
  roles?: Role[]
}

export type SidebarItem = {
  title: string
  url: string
  icon: LucideIcon
  isActive?: boolean
  permission?: Permission
  roles?: Role[]
  items?: SidebarSubItem[]
}

export function SidebarItems({ items }: { items: SidebarItem[] }) {
  const { user } = useAuth()
  const ability = useMemo(() => createAbility(user), [user])

  const filteredItems = useMemo(() => {
    const canAccess = (permission?: Permission, roles?: Role[]) => {
      if (permission && !ability.can(permission)) return false
      if (roles?.length && !ability.hasAnyRole(roles)) return false
      return true
    }

    return items
      .filter((item) => canAccess(item.permission, item.roles))
      .map((item) => ({
        ...item,
        items: item.items?.filter((subItem) =>
          canAccess(subItem.permission, subItem.roles)
        ),
      }))
  }, [ability, items])

  return <NavMain items={filteredItems} />
}
