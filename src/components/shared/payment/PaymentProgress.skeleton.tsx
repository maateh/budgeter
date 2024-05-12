// shadcn
import { Separator } from "@/components/ui/separator"
import { Skeleton, SkeletonList } from "@/components/ui/skeleton"

const PaymentProgressSkeleton = () => {
  return (
    <>
      <SkeletonList className="mb-3.5 flex flex-row flex-wrap justify-center gap-x-2.5 gap-y-1.5"
        itemProps={{ className: "w-24 h-8" }}
        amount={5}
      />

      <Skeleton className="w-2/5 h-4 mx-auto mb-2 rounded-sm" />
      <Separator className="w-3/5 mx-auto my-1.5" />
      <Skeleton className="h-4 min-w-32 max-w-sm mx-auto rounded-full" />

      <div className="mx-4 mt-2.5 flex justify-around gap-x-1.5">
        <Skeleton className="h-14 w-32 rounded-full" />
        <Skeleton className="h-14 w-32 rounded-full" />
      </div>
    </>
  )
}

export default PaymentProgressSkeleton
