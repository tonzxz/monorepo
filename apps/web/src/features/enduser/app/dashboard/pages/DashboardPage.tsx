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
import { SearchInput } from "@/components/common/dynamic/search"
import { StatCardGrid } from "@/components/common/dynamic/cards"
import { useAuth } from "@/hooks/useAuth"

export default function DashboardPage() {
  const { user } = useAuth()
  const [activityQuery, setActivityQuery] = useState("")
  
  // Extract first name from email or use email username
  const getGreeting = () => {
    if (!user?.email) return "Welcome back! 👋"
    
    const username = user.email.split('@')[0]
    const firstName = username.charAt(0).toUpperCase() + username.slice(1)
    
    return `Welcome back, ${firstName}! 👋`
  }
  
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
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* Welcome Greeting */}
          <div className="rounded-lg border bg-card p-6">
            <h1 className="text-3xl font-bold">
              {getGreeting()}
            </h1>
            <p className="text-muted-foreground mt-2">
                You're signed in as <span className="font-medium">{user?.email}</span> with the role: <span className="font-semibold capitalize">{user?.role || "Enduser"}</span>
            </p>
            <p className="text-muted-foreground mt-1">
              Here's what's happening with your inventory today.
            </p>
          </div>
          
          <StatCardGrid
            items={[
              {
                title: "Total Items",
                value: "1,234",
                description: "+20.1% from last month",
              },
              {
                title: "Pending Approvals",
                value: "23",
                description: "+4 from yesterday",
              },
              {
                title: "Active Users",
                value: "45",
                description: "+2 this week",
              },
              {
                title: "Departments",
                value: "12",
                description: "No change",
              },
            ]}
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest inventory and approval activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SearchInput
                value={activityQuery}
                onChange={(event) => setActivityQuery(event.target.value)}
                onClear={() => setActivityQuery("")}
                placeholder="Search activity..."
                containerClassName="mb-4"
              />
              <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        New item added: Office Chair
                      </p>
                      <p className="text-sm text-muted-foreground">
                        2 hours ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Approval request submitted for Laptop Purchase
                      </p>
                      <p className="text-sm text-muted-foreground">
                        4 hours ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        User John Doe created
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Yesterday
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Welcome</CardTitle>
                <CardDescription>
                  You are logged in as {user?.role}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Email:</strong> {user?.email}
                  </p>
                  <p className="text-sm">
                    <strong>Role:</strong> {user?.role}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Access the features available for your role using the sidebar navigation.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
