"use client"

import { useUser } from "@auth0/nextjs-auth0/client"
import Image from "next/image"
import Link from "next/link"
import nav_title from "public/assets/images/nav_title.png"

const Nav = () => {

  const { user, error, isLoading } = useUser()

  return (
    <nav className="w-full max-w-screen-2xl bg-red-200 p-4">
        <Link href="/">
            <Image
                src={nav_title}
                alt="nav title"
            />
        </Link>
    </nav>
  )
}

export default Nav

