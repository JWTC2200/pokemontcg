"use client"

import { useUser } from "@auth0/nextjs-auth0/client"
import { useState } from "react"
import Link from "next/link"
import { GiHamburgerMenu } from "react-icons/gi"
import ToTopButton from "./ToTopButton"

import { usePathname } from "next/navigation"


const Nav = () => {

  const { user } = useUser()
  const [menuToggle, setMenuToggle] = useState(false)

 
  const pathname = usePathname()

  const activeLink = "before:content-['-_'] after:content-['_-']"

  return (
    <nav className="relative w-full max-w-screen-2xl bg-slate-800 bg-opacity-75 px-8 sm:py-12 p-4 flex justify-end sm:justify-between flex-wrap items-center text-end sm:text-left gap-4">

      <div className="pulse_bead bottom-0 left-20"></div>
      <div className="pulse_bead top-4 right-6"></div>
      <div className="pulse_bead top-1/2 right-1/2"></div>

      <ToTopButton/>

      <Link href="/">
          <h1 className="text-2xl font-bold ">PTCG Deckbuilder</h1>
      </Link>

      <section className="md:flex gap-2 hidden">
        {user 
          ? <div className="flex gap-2">
            <Link 
              className={pathname == "/search" ? activeLink : ""} 
              href="/search"
            >
              Cards
            </Link>
            <Link 
              className={pathname == "/cardsets" ? activeLink : ""} 
              href="/cardsets"
            >
              Sets
            </Link>
            <Link 
              className={pathname == "/decks" ? activeLink : ""} 
              href="/decks"
            >
              Decks
            </Link>
            <Link 
              className=""
              href="/api/auth/logout"
            >
              Logout
            </Link>
          </div>
          : <Link className="" href="/api/auth/login">Login</Link>
        }      
      </section>

      <section className="md:hidden flex relative">
        { user
          ? <div>
            <GiHamburgerMenu
              alt={`menu icon`}
              className="rounded-xl h-12 w-12 p-1 cursor-pointer hover:scale-110 bg-white text-slate-700 text-3xl"
              onClick={() => setMenuToggle((prev)=>!prev)}
            />
            { menuToggle 
            ? <div className="absolute right-0 top-full mt-3 w-full p-5 rounded-lg bg-white min-w-[210px] flex flex-col gap-2 justify-end items-end z-50">
              <Link
                className="dropdown_link"
                href="/search"
                onClick={()=> setMenuToggle(false)}
              >
                Card Search
              </Link> 
              <Link
                className="dropdown_link"
                href="/cardsets"
                onClick={()=> setMenuToggle(false)}
              >
                Sets
              </Link>
              <Link
                className="dropdown_link"
                href="/decks"
                onClick={()=> setMenuToggle(false)}
              >
                Decks
              </Link>
              <Link
                className="dropdown_link mt-2 font-semibold text-lg"
                href="/api/auth/logout"
                onClick={()=> setMenuToggle(false)}
              >
                Logout
              </Link>
            </div>
            : null
            }
          </div>
          : <Link
            className=""
            href="/api/auth/login"
            onClick={()=> setMenuToggle(false)}
          >
            Login
          </Link>
        }
      </section>       
    </nav>
  )
}

export default Nav

