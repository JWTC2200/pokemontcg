"use client"

import { useUser } from "@auth0/nextjs-auth0/client"
import { useState } from "react"
import Link from "next/link"
import { GiHamburgerMenu } from "react-icons/gi"


const Nav = () => {

  const { user } = useUser()
  const [menuToggle, setMenuToggle] = useState(false)

  return (
    <nav className="w-full max-w-screen-2xl bg-slate-800 bg-opacity-75 p-8 flex justify-end sm:justify-between flex-wrap items-center text-end sm:text-left gap-4">
        <Link href="/">
            <h1 className="text-2xl font-bold ">PokemonTCG Card search!</h1>
        </Link>
        <section className="md:flex gap-2 hidden">
          {user 
            ? <div className="flex gap-2">
              <Link 
                className="nav_btn" 
                href="/search"
              >
                Cards
              </Link>
              <Link 
                className="nav_btn" 
                href="/decks"
              >
                Decks
              </Link>
              <Link 
                className="nav_btn" 
                href="/api/auth/logout"
              >
                Logout
              </Link>
            </div>
            : <Link className="nav_btn" href="/api/auth/login">Login</Link>
          }      
        </section>
        <section className="md:hidden flex relative">
          { user
            ? <div>
              <GiHamburgerMenu
                alt={`menu icon`}
                className="rounded-xl h-8 w-8 p-1 cursor-pointer hover:scale-110 bg-white text-slate-700 text-3xl"
                onClick={() => setMenuToggle((prev)=>!prev)}
              />
              { menuToggle 
              ? <div className="dropdown_menu">
                <Link
                  className="dropdown_link"
                  href="/search"
                  onClick={()=> setMenuToggle(false)}
                >
                  Card Search
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

