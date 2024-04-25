// shadcn
import { Separator } from "@/components/ui/separator"

type FilterLayoutProps = {
  title: React.ReactNode
} & React.PropsWithChildren

const FilterLayout = ({ title, children }: FilterLayoutProps) => {
  return (
    <div className="h-full flex flex-col px-6 py-5 bg-primary rounded-[2rem]">
      <h2 className="indent-border">
        {title}
      </h2>

      <Separator className="my-4 mx-auto w-11/12" />

      <div className="flex-1 flex flex-col justify-around gap-y-4">
        {children}
      </div>
    </div>
  )
}

export default FilterLayout
