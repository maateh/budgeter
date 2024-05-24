// shadcn
import { Skeleton } from "@/components/ui/skeleton"

const BalanceSummarySkeleton = () => {
  return (
    <div className="space-y-5">
      <Skeleton className="flex-1 max-w-60 h-20 mx-auto rounded-full" />

      <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2">
        <Skeleton className="flex-1 max-w-32 h-8 rounded-full" />
        <Skeleton className="flex-1 max-w-32 h-8 rounded-full" />
      </div>

      <div className="flex flex-wrap justify-around gap-x-4 gap-y-2">
        <Skeleton className="flex-1 min-w-36 max-w-80 h-10 rounded-full" />
        <Skeleton className="flex-1 min-w-36 max-w-80 h-10 rounded-full" />
      </div>
    </div>
  )
}

export default BalanceSummarySkeleton
