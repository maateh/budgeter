import { useRef } from "react"
import { NavLink } from "react-router-dom"

// icons
import { Menu, PiggyBank } from "lucide-react"

// constants
import { navLinks } from "@/constants"

// components
import ThemeSwitcher from "../theme/ThemeSwitcher"

const Navbar = () => {
  const linksRef = useRef<HTMLUListElement>(null)

  return (
    <header className="max-container">
      <nav className=" relative mx-5 my-4 mb-2 px-7 py-3 flex flex-col md:flex-row items-start md:items-center md:justify-between bg-secondary rounded-[2.15rem] md:rounded-full">
        <div className="w-[93.75%] flex justify-between items-center">
          <NavLink to="/" className="icon-wrapper">
            <PiggyBank size={40} strokeWidth={1} />
            <span className="text-xl md:text-2xl font-bold font-heading small-caps overline tracking-wider">
              MyBudget
            </span>
          </NavLink>

          <Menu
            onClick={() => linksRef.current?.classList.toggle('mobile-closed')}
            className="md:hidden cursor-pointer"
            size={28}
          />
        </div>

        <ul ref={linksRef} className="w-full md:w-1/2 max-md:mt-2 md:mr-8 flex flex-col md:flex-row justify-center md:justify-end items-center gap-1 md:gap-4 max-md:[&.mobile-closed]:hidden mobile-closed">
          {navLinks.map(link => (
            <li key={link.label}>
              <NavLink
                to={link.link}
                className="py-2 px-4 text-lg font-normal tracking-wide icon-wrapper border-md [&.active]:bg-primary"
              >
                <link.Icon size={24} />
                <span>{link.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="absolute right-1.5 border-l-[1px] border-l-background">
          <ThemeSwitcher />
        </div>
      </nav>
    </header>
  )
}

export default Navbar
