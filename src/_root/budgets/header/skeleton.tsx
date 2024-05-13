// shadcn
import { Skeleton } from "@/components/ui/skeleton"

const BudgetHeaderSkeleton = () => {
  return (
    <div className="flex flex-wrap justify-between items-center gap-2.5">
      <Skeleton className="w-full max-w-56 h-14 rounded-full" />
      <Skeleton className="ml-auto size-8 rounded-full sm:size-10" />
    </div>
  )
}

export default BudgetHeaderSkeleton
