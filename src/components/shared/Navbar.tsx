import { useRef } from "react"
import { NavLink } from "react-router-dom"

// icons
import { Menu, PiggyBank } from "lucide-react"

// constants
import { navLinks } from "@/constants"

const Navbar = () => {
  const linksRef = useRef<HTMLUListElement>(null)

  return (
    <header className="max-container">
      <nav className="relative my-5 mx-6 py-3 px-7 flex flex-col md:flex-row items-start md:items-center md:justify-between bg-secondary rounded-[2.15rem] md:rounded-full border-b-neutral-800 border-b-[1px]">
        <div className="w-full flex justify-between items-center">
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

        <ul ref={linksRef} className="w-full md:w-1/2 max-md:mt-2 flex flex-col md:flex-row justify-center md:justify-end items-center gap-1 md:gap-4 max-md:[&.mobile-closed]:hidden mobile-closed">
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
      </nav>
    </header>
  )
}

export default Navbar
