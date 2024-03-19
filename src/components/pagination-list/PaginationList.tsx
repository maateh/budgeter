
// types
import { Pagination } from "@/services/api/types"

// utils
import { cn } from "@/lib/utils"

type PaginationListProps<T extends { id: string }> = {
  pages: Pagination<T>[]
  children: (item: T) => React.ReactNode
  itemProps?: React.LiHTMLAttributes<HTMLLIElement>
} & Omit<React.HTMLAttributes<HTMLUListElement>, 'children'>

function PaginationList<T extends { id: string }>({ pages, children, className, itemProps, ...props }: PaginationListProps<T>) {
  return (
    <ul className={cn("flex flex-col gap-y-2.5", className)} {...props}>
      {pages.map((page) => page.data.map((item) => (
        <li key={item.id} {...itemProps}>
          {children(item)}
        </li>
      )))}
    </ul>
  )
}

export default PaginationList
