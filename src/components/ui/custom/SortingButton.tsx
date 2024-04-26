// icons
import { ArrowUpDown, LucideIcon, SortAsc, SortDesc } from "lucide-react"

// shadcn
import { Button, ButtonProps } from "@/components/ui/button"

// hooks
import { useSorting } from "@/hooks"

// utils
import { cn } from "@/lib/utils"

type SortingButtonProps = {
  sortingKey: string
} & React.PropsWithChildren & Omit<ButtonProps, 'onClick'>

const SortingButton = ({
  sortingKey, children,
  className, variant = "ghost", size = "sm", ...props
}: SortingButtonProps) => {
  const { sortBy, toggleSort } = useSorting()

  let SortingIcon: LucideIcon = ArrowUpDown
  if (sortBy?.[sortingKey] === '1') {
    SortingIcon = SortAsc
  }

  if (sortBy?.[sortingKey] === '-1') {
    SortingIcon = SortDesc
  }
  
  return (
    <Button className={cn("-mx-2 px-2 rounded-lg shadow-none icon-wrapper", className)}
      variant={variant}
      size={size}
      onClick={() => toggleSort(sortingKey)}
      {...props}
    >
      {children}
      <SortingIcon size={15} />
    </Button>
  )
}

export default SortingButton
