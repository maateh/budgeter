// icons
import { BadgeInfo } from "lucide-react"

// components
import InfoBadge, { InfoBadgeProps } from "@/components/ui/custom/InfoBadge"

// types
import { Pagination } from "@/services/api/types"

// utils
import { cn } from "@/lib/utils"

type ListingData<T> = {
  pages: Pagination<T>[]
  items?: never
} | {
  items: T[]
  pages?: never
}

type ListingFallback = {
  fallbackProps?: InfoBadgeProps
  customFallback?: never
} | {
  customFallback?: React.ReactNode
  fallbackProps?: never
}

type ListingProps<T extends { id: string }> = {
  children: (item: T) => React.ReactNode
  firstElement?: React.ReactNode
  lastElement?: React.ReactNode
  itemProps?: React.LiHTMLAttributes<HTMLLIElement>
} & ListingData<T>
  & ListingFallback
  & Omit<React.HTMLAttributes<HTMLUListElement>, 'children'>

function Listing<T extends { id: string }>({
  children, firstElement, lastElement, itemProps,
  pages, items,
  fallbackProps, customFallback,
  className, ...props
}: ListingProps<T>) {
  const fallbackElement = customFallback || (
    <InfoBadge
      separatorProps={{ className: "h-4" }}
      valueProps={{ className: "text-sm font-body font-normal break-words" }}
      orientation="vertical"
      variant="destructive"
      size="sm"
      icon={<BadgeInfo className="text-destructive" size={20} />}
      value="No items to show."
      {...fallbackProps}
    />
  )

  return (
    <ul className={cn("flex flex-col gap-y-2.5", className)} {...props}>
      {firstElement && <li>{firstElement}</li>}

      {pages ? pages[0].data.length ? pages.map((page) => page.data.map((item) => (
        <li key={item.id} {...itemProps}>
          {children(item)}
        </li>
      ))) : fallbackElement : items.length ? items.map((item) => (
        <li key={item.id} {...itemProps}>
          {children(item)}
        </li>
      )) : fallbackElement}

      {lastElement && <li>{lastElement}</li>}
    </ul>
  )
}

export default Listing
