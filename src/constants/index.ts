// icons
import { Receipt, Coins, Gift, LucideIcon } from "lucide-react"

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
  },
  {
    label: 'Splitter',
    link: '/splitter',
    Icon: Coins
  },
  {
    label: 'Wishlist',
    link: '/wishlist',
    Icon: Gift
  }
]
