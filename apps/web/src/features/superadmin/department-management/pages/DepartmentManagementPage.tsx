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
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { SearchInput } from "@/components/common/dynamic/search"
import { ConfirmationModal } from "@/components/common/dynamic/confirmation-modal"
import { FailedState } from "@/components/common/dynamic/failed"

export default function DepartmentManagementPage() {
  const [query, setQuery] = useState("")
  const [isSyncOpen, setIsSyncOpen] = useState(false)

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
                  <BreadcrumbPage>Department Management</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Department Management</h1>
              <p className="text-muted-foreground">
                Organize teams and manage department hierarchies.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsSyncOpen(true)}>
                Sync Departments
              </Button>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Department
              </Button>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Departments</CardTitle>
              <CardDescription>
                Manage organizational departments and their structure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SearchInput
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onClear={() => setQuery("")}
                placeholder="Search departments..."
                containerClassName="mb-4"
              />
              <FailedState
                title="No departments loaded"
                description="Connect to the directory to sync departments."
              />
            </CardContent>
          </Card>
        </div>
      </SidebarInset>

      <ConfirmationModal
        open={isSyncOpen}
        onOpenChange={setIsSyncOpen}
        title="Sync departments?"
        description="This will refresh departments from the directory service."
        confirmText="Sync now"
        onConfirm={() => setIsSyncOpen(false)}
      />
    </SidebarProvider>
  )
}
