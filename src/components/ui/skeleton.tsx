import { cn } from "@/lib/utils"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("animate-pulse rounded-xl bg-secondary/90", className)}
    {...props}
  />
)

interface SkeletonListProps extends React.HTMLAttributes<HTMLUListElement> {
  amount: number
  itemProps?: React.HTMLAttributes<HTMLLIElement>
}

const SkeletonList = ({ amount, itemProps, className, ...props }: SkeletonListProps) => (
  <ul className={cn("mx-2.5 flex flex-col gap-y-3.5", className)} {...props}>
    {Array(amount).fill('').map((_, index) => (
      <li {...itemProps}
        className={cn("h-11 animate-pulse rounded-full bg-secondary/90", itemProps?.className)}
        key={index}
      />
    ))}
  </ul>
)

interface SkeletonTableProps extends React.HTMLAttributes<HTMLTableElement> {
  columns?: number
  rows?: number
}

const SkeletonTable = ({ columns = 3, rows = 5 }: SkeletonTableProps) => (
  <Table>
    <TableHeader>
      <TableRow>
        {Array(columns).fill('').map((_, colIndex) => (
          <TableHead key={colIndex}>
            <Skeleton className="w-4/5 max-w-40 h-8 mx-auto rounded-md" />
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
    <TableBody>
      {Array(rows).fill('').map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {Array(columns).fill('').map((_, colIndex) => (
            <TableCell key={`${rowIndex}-${colIndex}`}>
              <Skeleton className="w-full max-w-48 h-7 mx-auto rounded-lg" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  </Table>
)

interface SpinnerProps extends React.SVGProps<SVGSVGElement> {
  size?: number
}

const Spinner = ({ size = 28, className, ...props }: SpinnerProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("animate-spin text-foreground/75", className)}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}

const PageLoader = () => (
  <Spinner className="absolute m-auto inset-0" size={48} />
)

export {
  Skeleton,
  SkeletonList,
  SkeletonTable,
  Spinner,
  PageLoader
}
