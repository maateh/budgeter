// shadcn
import { SkeletonList } from "@/components/ui/skeleton"

const NoteListSkeleton = () => {
  return (
    <SkeletonList className="w-11/12 mx-auto"
      itemProps={{ className: "h-24 rounded-3xl" }}
      amount={3}
    />
  )
}

export default NoteListSkeleton
