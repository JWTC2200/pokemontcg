"use client"

import { useUser } from "@auth0/nextjs-auth0/client"
import Link from "next/link"

export default function Index() {

  const { user } = useUser()

  return (
    <section className="page_container">
      <h1 className="text-3xl font-extrabold">
        Welcome{user?.name ? " " + user.name : null}, to the PokemonTCG Card Search! 
      </h1>
      { user 
        ? <Link
            href="/search"
            className="red_btn"
          >
            Search
          </Link>
        : null
      }
    </section>
  )
}