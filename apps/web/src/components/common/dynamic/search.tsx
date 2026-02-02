import type { ComponentProps } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type SearchInputProps = Omit<ComponentProps<typeof Input>, "type"> & {
  containerClassName?: string
  onClear?: () => void
}

export function SearchInput({
  className,
  containerClassName,
  onClear,
  value,
  placeholder = "Search...",
  ...props
}: SearchInputProps) {
  const hasValue = typeof value === "string" ? value.length > 0 : Boolean(value)

  return (
    <div className={cn("relative w-full", containerClassName)}>
      <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
      <Input
        type="search"
        placeholder={placeholder}
        className={cn("pl-9 pr-9", className)}
        value={value}
        {...props}
      />
      {hasValue && onClear ? (
        <button
          type="button"
          onClick={onClear}
          className="text-muted-foreground hover:text-foreground absolute right-2 top-1/2 -translate-y-1/2 rounded p-1"
          aria-label="Clear search"
        >
          <X className="size-4" />
        </button>
      ) : null}
    </div>
  )
}
