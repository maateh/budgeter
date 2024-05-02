// shadcn
import { DialogContent, DialogFooter, DialogHeader } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Skeleton, Spinner } from '@/components/ui/skeleton'

const TransactionDetailsSkeleton = () => {
  return (
    <DialogContent>
      <DialogHeader className="h-9">
        <div className="h-full w-full flex justify-between items-center gap-x-8">
          <Skeleton className="flex-1 h-full max-w-60" />
          <Skeleton className="flex-1 h-full max-w-44 mr-6 rounded-full" />
        </div>
      </DialogHeader>

      <Separator className="my-2" />

      <Spinner className="mx-auto my-8" size={40} />

      <Separator className="my-2" />

      <DialogFooter className="h-9">
        <div className="h-full w-full flex justify-between items-center gap-x-8">
          <div className="flex-1 h-full flex items-center gap-x-2.5">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="flex-1 h-9 max-w-32 rounded-full" />
          </div>
          <Skeleton className="flex-1 h-8 max-w-24 rounded-full" />
        </div>
      </DialogFooter>
    </DialogContent>
  )
}

export default TransactionDetailsSkeleton
