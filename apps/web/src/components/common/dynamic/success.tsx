import { CheckCircle2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function SuccessState({
  title = "Success",
  description = "Your action completed successfully.",
  className,
}: {
  title?: string
  description?: string
  className?: string
}) {
  return (
    <Card className={cn("border-dashed", className)}>
      <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
        <CheckCircle2 className="size-8 text-emerald-500" />
        <div className="space-y-1">
          <p className="font-medium">{title}</p>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
