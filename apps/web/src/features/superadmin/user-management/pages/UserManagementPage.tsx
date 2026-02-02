import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { SearchInput } from "@/components/common/dynamic/search"
import { SuccessState } from "@/components/common/dynamic/success"
import { ViewModal } from "@/components/common/dynamic/view-modal"
import { DeleteModal } from "@/components/common/dynamic/delete-modal"
import { CreateModal } from "@/components/common/dynamic/create-modal"
import { Input } from "@/components/ui/input"

export default function UserManagementPage() {
  const [query, setQuery] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<{
    name: string
    email: string
    role: string
  } | null>(null)
  const [newUserName, setNewUserName] = useState("")
  const [newUserEmail, setNewUserEmail] = useState("")
  const [newUserRole, setNewUserRole] = useState("")

  const users = useMemo(
    () => [
      { name: "Jane Doe", email: "jane@quanbyit.com", role: "Enduser" },
      { name: "Mark Rivera", email: "mark@quanbyit.com", role: "Supply" },
      { name: "Ana Santos", email: "ana@quanbyit.com", role: "Inspection" },
    ],
    []
  )

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase()) ||
      user.role.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>User Management</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
              <p className="text-muted-foreground">
                Create users, assign roles, and control access.
              </p>
            </div>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                Manage user accounts and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SearchInput
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onClear={() => setQuery("")}
                placeholder="Search users..."
                containerClassName="mb-4"
              />
              <div className="space-y-3">
                {filteredUsers.map((user) => (
                  <div
                    key={user.email}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-md border px-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email} • {user.role}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedUser(user)
                          setIsViewOpen(true)
                        }}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelectedUser(user)
                          setIsDeleteOpen(true)
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <SuccessState
            title="User sync complete"
            description="All user records are up to date."
          />
        </div>
      </SidebarInset>

      <CreateModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        title="Add User"
        description="Create a new user account."
        submitText="Create User"
        onSubmit={(event) => {
          event.preventDefault()
          setIsCreateOpen(false)
          setNewUserName("")
          setNewUserEmail("")
          setNewUserRole("")
        }}
      >
        <Input
          placeholder="Full name"
          value={newUserName}
          onChange={(event) => setNewUserName(event.target.value)}
          required
        />
        <Input
          placeholder="Email address"
          type="email"
          value={newUserEmail}
          onChange={(event) => setNewUserEmail(event.target.value)}
          required
        />
        <Input
          placeholder="Role"
          value={newUserRole}
          onChange={(event) => setNewUserRole(event.target.value)}
        />
      </CreateModal>

      <ViewModal
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        title={selectedUser?.name ?? "User"}
        description="User profile details"
      >
        <div className="text-sm">
          <p className="font-medium">Email</p>
          <p className="text-muted-foreground">{selectedUser?.email}</p>
        </div>
        <div className="text-sm">
          <p className="font-medium">Role</p>
          <p className="text-muted-foreground">{selectedUser?.role}</p>
        </div>
      </ViewModal>

      <DeleteModal
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete user?"
        description={`Remove ${selectedUser?.name ?? "this user"} from the system.`}
        onConfirm={() => setIsDeleteOpen(false)}
      />
    </SidebarProvider>
  )
}
