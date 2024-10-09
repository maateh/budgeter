// icons
import { Receipt, LucideIcon } from "lucide-react"

export const BASE_PAGE_TITLE: string = 'Budgeter'

type NavLink = {
  label: string
  link: string
  Icon: LucideIcon
}

export const navLinks: NavLink[] = [
  {
    label: 'Transactions',
    link: '/transactions',
    Icon: Receipt
  }
]
