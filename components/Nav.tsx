"use client"

import { useUser } from "@auth0/nextjs-auth0/client"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { BsFillFilePersonFill } from "react-icons/bs"


const Nav = () => {

  const { user } = useUser()
  const [menuToggle, setMenuToggle] = useState(false)

  return (
    <nav className="w-full max-w-screen-2xl bg-slate-800 bg-opacity-75 p-8 flex justify-between flex-wrap items-center gap-4">
        <Link href="/">
            <h1 className="text-2xl font-bold ">PokemonTCG Card search!</h1>
        </Link>
        <section className="md:flex gap-2 hidden">
          {user 
            ? <div className="flex gap-2">
              <Link 
                className="red_btn" 
                href="/search"
              >
                Cards
              </Link>
              <Link 
                className="red_btn" 
                href="/cardsets"
              >
                Sets
              </Link>
              <Link 
                className="red_btn" 
                href="/decks"
              >
                Decks
              </Link>
              <Link 
                className="red_btn" 
                href="/api/auth/logout"
              >
                Logout
              </Link>
            </div>
            : <Link className="red_btn" href="/api/auth/login">Login</Link>
          }      
        </section>
        <section className="md:hidden flex relative">
          { user
            ? <div>
              <Image
                src={user.picture ? user.picture : ""}
                width={40}
                height={40}
                alt={`${user.name} icon`}
                className="rounded-full cursor-pointer hover:scale-110"
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
                  href="/cardsets"
                  onClick={()=> setMenuToggle(false)}
                >
                  Set Search
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
              href="/cardsets"
              onClick={()=> setMenuToggle(false)}
            >
              <BsFillFilePersonFill className="text-2xl"/>
            </Link>
          }
        </section>
        
    </nav>
  )
}

export default Nav

