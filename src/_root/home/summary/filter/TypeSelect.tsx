// shadcn
import { Separator } from "@/components/ui/separator"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const TypeSelect = () => {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <p className="text-base font-heading indent-border">
        <span className="text-accent overline">Filter</span> by
      </p>

      <Separator className="h-3.5 w-1 rounded-full bg-foreground/10" orientation="vertical" />

      <ToggleGroup type="single">
        <ToggleGroupItem value="budgets"
          size="xs"
          variant="outline"
          onSelect={() => {}} // TODO:
        >
          Budgets
        </ToggleGroupItem>
        <ToggleGroupItem value="currencies"
          size="xs"
          variant="outline"
          onSelect={() => {}} // TODO:
        >
          Currencies
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}

export default TypeSelect
