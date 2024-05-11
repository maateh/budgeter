import { useRef } from "react"
import { NavLink } from "react-router-dom"

// icons
import { Menu, PiggyBank } from "lucide-react"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import ThemeSwitch from "@/components/theme/ThemeSwitch"

// constants
import { navLinks } from "@/constants"

const Navbar = () => {
  const linksRef = useRef<HTMLUListElement>(null)

  return (
    <header className="max-container py-4">
      <nav className="min-w-60 mx-2 px-3.5 py-3 flex flex-col bg-secondary/80 shadow-primary shadow-sm drop-shadow-sm rounded-[2rem] md:mx-5 md:px-6 lg:flex-row lg:justify-between lg:items-center">
        <div className="flex justify-between items-center gap-x-4">
          <NavLink to="/" className="flex gap-x-2 items-end md:gap-x-3">
            <PiggyBank className="size-7 md:size-9 lg:size-10" strokeWidth={1.25} />
            <span className="text-xl font-bold font-heading tracking-wider md:text-2xl lg:text-3xl">
              Budgeter
            </span>
          </NavLink>

          <div className="-mr-2 flex items-center gap-x-2 lg:absolute lg:right-4 lg:mr-0">
            <Menu className="size-6 cursor-pointer md:size-7 lg:hidden"
              onClick={() => linksRef.current?.classList.toggle('mobile-closed')}
            />

            <Separator className="h-7 w-0.5 bg-background/60 rounded-full md:h-8"
              orientation="vertical"
            />

            <ThemeSwitch />
          </div>
        </div>

        <ul ref={linksRef} className="flex flex-wrap justify-around items-center gap-x-6 gap-y-2 mobile-closed max-lg:[&.mobile-closed]:hidden lg:mx-8 lg:justify-around">
          <Separator className="w-5/6 my-3 bg-foreground/15 lg:hidden" />

          {navLinks.map(({ link, label, Icon }) => (
            <li key={label}>
              <NavLink className="py-2 px-4 icon-wrapper border-md [&.active]:bg-accent/65 [&.active]:shadow-lg drop-shadow-md"
                to={link}
              >
                <Icon size={22} />
                <span className="text-sm font-heading font-medium tracking-wide md:text-base">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

export default Navbar
