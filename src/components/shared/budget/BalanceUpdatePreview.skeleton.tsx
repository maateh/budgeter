// icons
import { ArrowDown } from "lucide-react"

// shadcn
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

const BalanceUpdatePreviewSkeleton = () => {
  return (
    <div className="min-w-40 flex flex-col items-center gap-y-1.5">
      <Skeleton className="w-full max-w-32 h-6 rounded-full" />

      <Separator className="w-1/3 mx-auto" />

      <Skeleton className="w-full max-w-28 h-7 rounded-full" />

      <Skeleton className="w-full max-w-16 h-8 rounded-full" />

      <ArrowDown className="text-muted" strokeWidth={7} />

      <Skeleton className="w-full max-w-28 h-7 rounded-full" />
    </div>
  )
}

export default BalanceUpdatePreviewSkeleton
