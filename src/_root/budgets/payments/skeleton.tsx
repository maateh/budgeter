// shadcn
import { SkeletonList } from "@/components/ui/skeleton"

const BudgetPaymentsSkeleton = () => {
  return (
    <SkeletonList className="mx-4 flex flex-wrap flex-row justify-center items-center gap-x-2.5 gap-y-1.5"
      itemProps={{ className: "h-8 w-32" }}
      amount={9}
    />
  )
}

export default BudgetPaymentsSkeleton
