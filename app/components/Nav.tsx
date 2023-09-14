"use client"

import { useUser } from "@auth0/nextjs-auth0/client"
import Image from "next/image"
import Link from "next/link"
import nav_title from "public/assets/images/nav_title.png"

const Nav = () => {

  const { user } = useUser()

  return (
    <nav className="w-full max-w-screen-2xl bg-slate-800 bg-opacity-75 p-8 flex justify-between flex-wrap items-center gap-4">
        <Link href="/">
            <Image
                src={nav_title}
                alt="nav title"
            />
        </Link>
        <section className="flex gap-2">
          {user 
            ? <Link className="red_btn" href="/api/auth/logout">Logout</Link>
            : <Link className="red_btn" href="/api/auth/login">Login</Link>
          }      
        </section>
    </nav>
  )
}

export default Nav

