import { useRef } from "react"
import { NavLink } from "react-router-dom"

// icons
import { Menu, PiggyBank } from "lucide-react"

// components
import ThemeSwitch from "@/components/theme/ThemeSwitch"

// constants
import { navLinks } from "@/constants"

const Navbar = () => {
  const linksRef = useRef<HTMLUListElement>(null)

  return (
    <header className="max-container py-4">
      <nav className="mx-5 px-6 py-3 relative flex flex-col bg-secondary rounded-[2rem] md:flex-row md:justify-between md:items-center">
        <div className="w-full flex justify-between items-center">
          <NavLink to="/" className="icon-wrapper !items-end">
            <PiggyBank size={40} strokeWidth={1} />
            <span className="text-3xl font-bold font-heading small-caps overline tracking-wider">
              MyBudget
            </span>
          </NavLink>

          <Menu
            onClick={() => linksRef.current?.classList.toggle('mobile-closed')}
            className="md:hidden cursor-pointer mr-8"
            size={28}
          />
        </div>

        <ul ref={linksRef} className="w-full md:w-1/2 max-md:mt-2 md:mr-8 flex flex-col md:flex-row justify-center md:justify-end items-center gap-1 md:gap-4 max-md:[&.mobile-closed]:hidden mobile-closed">
          {navLinks.map((link) => (
            <li key={link.label}>
              <NavLink
                to={link.link}
                className="py-2 px-4 text-lg font-medium tracking-wide icon-wrapper border-md [&.active]:bg-primary"
              >
                <link.Icon size={24} />
                <span>{link.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="absolute pl-1 right-1.5 border-l border-l-background/60 max-md:top-[1.175rem]">
          <ThemeSwitch />
        </div>
      </nav>
    </header>
  )
}

export default Navbar
