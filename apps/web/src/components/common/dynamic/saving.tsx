import { Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function SavingState({
  title = "Saving",
  description = "Saving your changes. Please wait.",
  className,
}: {
  title?: string
  description?: string
  className?: string
}) {
  return (
    <Card className={cn("border-dashed", className)}>
      <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
        <Loader2 className="text-muted-foreground size-8 animate-spin" />
        <div className="space-y-1">
          <p className="font-medium">{title}</p>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
