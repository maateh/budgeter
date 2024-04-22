// hooks
import { useSorting } from "@/hooks"

type SortingHeaderProps = {
  sortingKey: string
} & React.PropsWithChildren & Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'>

function SortingHeader({ sortingKey, children, ...props }: SortingHeaderProps) {
  const { toggleSort } = useSorting()

  // TODO: add sorting icons
  return (
    <div onClick={() => toggleSort(sortingKey)} {...props}>
      {children}
    </div>
  )
}

export default SortingHeader
