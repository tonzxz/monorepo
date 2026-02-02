import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const columnClasses: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-6",
}

export type StatCardItem = {
  title: string
  value: ReactNode
  description?: ReactNode
  footer?: ReactNode
  icon?: LucideIcon
}

export function StatCard({
  title,
  value,
  description,
  footer,
  icon: Icon,
  className,
}: StatCardItem & { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon ? <Icon className="h-4 w-4 text-muted-foreground" /> : null}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description ? (
          <CardDescription className="text-xs">{description}</CardDescription>
        ) : null}
      </CardContent>
      {footer ? <CardFooter className="pt-0">{footer}</CardFooter> : null}
    </Card>
  )
}

export function StatCardGrid({
  items,
  columns = 4,
  className,
}: {
  items: StatCardItem[]
  columns?: 1 | 2 | 3 | 4 | 5 | 6
  className?: string
}) {
  return (
    <div
      className={cn(
        "grid gap-4 md:grid-cols-2",
        columnClasses[columns] ?? columnClasses[4],
        className
      )}
    >
      {items.map((item) => (
        <StatCard key={item.title} {...item} />
      ))}
    </div>
  )
}
