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
import { useState, type FormEvent } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { SearchInput } from "@/components/common/dynamic/search"
import { StatCardGrid } from "@/components/common/dynamic/cards"
import { CreateModal } from "@/components/common/dynamic/create-modal"
import { Input } from "@/components/ui/input"

export default function InventoryPage() {
  const [query, setQuery] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newItemName, setNewItemName] = useState("")
  const [newItemCategory, setNewItemCategory] = useState("")
  const [newItemQuantity, setNewItemQuantity] = useState("")

  const handleCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsCreateOpen(false)
    setNewItemName("")
    setNewItemCategory("")
    setNewItemQuantity("")
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
                  <BreadcrumbPage>Inventory</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Inventory Management</h1>
              <p className="text-muted-foreground">
                Manage your inventory items and track stock levels.
              </p>
            </div>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>

          <StatCardGrid
            items={[
              {
                title: "Total Items",
                value: "1,234",
                description: "+20.1% from last month",
              },
              {
                title: "Low Stock",
                value: "23",
                description: "Items below threshold",
              },
              {
                title: "Categories",
                value: "45",
                description: "Active categories",
              },
              {
                title: "Total Value",
                value: "₱2.1M",
                description: "Total inventory value",
              },
            ]}
          />

          <Card>
            <CardHeader>
              <CardTitle>Recent Items</CardTitle>
              <CardDescription>
                Latest inventory items added to the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SearchInput
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onClear={() => setQuery("")}
                placeholder="Search items..."
                containerClassName="mb-4"
              />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Office Chair - Ergonomic</p>
                    <p className="text-sm text-muted-foreground">Category: Furniture • Stock: 15</p>
                  </div>
                  <div className="text-sm">₱12,500</div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Laptop - ThinkPad X1</p>
                    <p className="text-sm text-muted-foreground">Category: Electronics • Stock: 8</p>
                  </div>
                  <div className="text-sm">₱85,000</div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Printer - HP LaserJet</p>
                    <p className="text-sm text-muted-foreground">Category: Office Equipment • Stock: 3</p>
                  </div>
                  <div className="text-sm">₱25,000</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>

      <CreateModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        title="Add Item"
        description="Create a new inventory item."
        submitText="Create Item"
        onSubmit={handleCreate}
      >
        <Input
          placeholder="Item name"
          value={newItemName}
          onChange={(event) => setNewItemName(event.target.value)}
          required
        />
        <Input
          placeholder="Category"
          value={newItemCategory}
          onChange={(event) => setNewItemCategory(event.target.value)}
        />
        <Input
          placeholder="Quantity"
          value={newItemQuantity}
          onChange={(event) => setNewItemQuantity(event.target.value)}
          type="number"
          min={0}
        />
      </CreateModal>
    </SidebarProvider>
  )
}
