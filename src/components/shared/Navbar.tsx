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
      <nav className="mx-5 px-6 py-3 relative flex flex-col bg-secondary/80 rounded-[2rem] lg:flex-row lg:justify-between lg:items-center">
        <div className="flex justify-between items-center">
          <NavLink to="/" className="flex gap-x-1.5 items-end md:gap-x-2.5">
            <PiggyBank className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1} />
            <span className="text-2xl font-bold font-heading small-caps overline tracking-wider md:text-3xl">
              MyBudget
            </span>
          </NavLink>

          <Menu className="mr-8 cursor-pointer lg:hidden"
            size={30}
            onClick={() => linksRef.current?.classList.toggle('mobile-closed')}
          />
        </div>

        <ul ref={linksRef} className="flex flex-wrap justify-around items-center gap-x-5 gap-y-2 mobile-closed max-lg:[&.mobile-closed]:hidden lg:w-1/2 lg:mr-8 lg:flex-row lg:flex-nowrap lg:gap-x-6 lg:justify-end">
          <Separator className="w-5/6 my-3 bg-foreground/15 lg:hidden" />
          {navLinks.map((link) => (
            <li key={link.label}>
              <NavLink className="py-2 px-4 icon-wrapper border-md [&.active]:bg-accent/65 [&.active]:shadow-lg drop-shadow-md"
                to={link.link}
              >
                <link.Icon size={22} />
                <span className="text-base font-heading font-medium tracking-wide">{link.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="absolute pl-1.5 right-1.5 border-l-2 border-l-background/60 max-lg:top-4">
          <ThemeSwitch />
        </div>
      </nav>
    </header>
  )
}

export default Navbar
