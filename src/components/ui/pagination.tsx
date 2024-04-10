import * as React from "react"
import { ChevronLeft, ChevronRight, ChevronsLeftIcon, ChevronsRightIcon, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { ButtonProps, buttonVariants } from "@/components/ui/button"

export type PaginationProps = React.ComponentProps<"nav">

const Pagination = ({ className, ...props }: PaginationProps) => (
  <nav className={cn("flex w-full justify-center", className)}
    role="navigation"
    aria-label="pagination"
    {...props}
  />
)
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul className={cn("flex flex-row items-center gap-1.5", className)}
    ref={ref}
    {...props}
  />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

type PaginationLinkProps = {
  isActive?: boolean
  disabled?: boolean
} & Pick<ButtonProps, "variant" | "size"> &
  React.ComponentProps<"a">

const PaginationLink = ({
  className,
  isActive,
  disabled,
  onClick,
  variant = "outline",
  size = "icon",
  ...props
}: PaginationLinkProps) => (
  <a className={cn("icon-wrapper hover:cursor-pointer",
      isActive && 'bg-foreground/25',
      disabled && 'opacity-50 hover:cursor-not-allowed',
      buttonVariants({ variant, size }),
      className
    )}
    onClick={!disabled ? onClick : undefined}
    aria-current={isActive ? "page" : undefined}
    {...props}
  />
)
PaginationLink.displayName = "PaginationLink"

const PaginationFirst = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink className={cn("p-2", className)}
    aria-label="Go to previous page"
    {...props}
  >
    <ChevronsLeftIcon className="h-4 w-4" />
    <span className="sr-only">Go to first page</span>
  </PaginationLink>
)
PaginationFirst.displayName = "PaginationFirst"

const PaginationPrevious = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink className={cn("p-2", className)}
    aria-label="Go to previous page"
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span className="sr-only">Previous</span>
  </PaginationLink>
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink className={cn("p-2", className)}
    aria-label="Go to next page"
    {...props}
  >
    <span className="sr-only">Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
)
PaginationNext.displayName = "PaginationNext"

const PaginationLast = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink className={cn("p-2", className)}
    aria-label="Go to previous page"
    {...props}
  >
    <span className="sr-only">Go to last page</span>
    <ChevronsRightIcon className="h-4 w-4" />
  </PaginationLink>
)
PaginationLast.displayName = "PaginationLast"

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span className={cn("flex h-9 w-9 items-center justify-center", className)}
    aria-hidden
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

type PaginationInfoProps = {
  currentPage: number
  totalPage: number
} & React.ComponentProps<"span">

const PaginationInfo = ({
  currentPage,
  totalPage,
  className,
  ...props
}: PaginationInfoProps) => (
  <span className={cn("text-sm font-medium", className)}
    aria-hidden
    {...props}
  >
    Page {currentPage} of {totalPage}
  </span>
)
PaginationInfo.displayName = "PaginationInfo"

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationFirst,
  PaginationPrevious,
  PaginationNext,
  PaginationLast,
  PaginationInfo,
}
