// shadcn
import { SkeletonList } from "@/components/ui/skeleton"

const BudgetListSkeleton = () => (
  <SkeletonList className="flex flex-row flex-wrap justify-around gap-x-6 gap-y-4"
    itemProps={{ className: "flex-1 w-full h-48 max-w-md rounded-3xl sm:min-w-72 max-sm:min-w-56" }}
    amount={3}
  />
)

export default BudgetListSkeleton
