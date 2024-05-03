// shadcn
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

const BudgetSummarySkeleton = () => {
  return (
    <>
      <Skeleton className="w-full max-w-56 h-14 rounded-full" />

      <Separator className="w-5/6 mx-auto my-5" />

      <div className="flex flex-wrap justify-around gap-x-6 gap-y-4">
        <Skeleton className="flex-1 max-w-64 h-20 rounded-full" />
        <Skeleton className="flex-1 max-w-64 h-20 rounded-full" />
      </div>

      <div className="mt-5 flex flex-wrap justify-center items-center gap-x-4 gap-y-2">
        <Skeleton className="flex-1 max-w-32 h-8 rounded-full" />
        <Skeleton className="flex-1 max-w-32 h-8 rounded-full" />
      </div>
    </>
  )
}

export default BudgetSummarySkeleton
